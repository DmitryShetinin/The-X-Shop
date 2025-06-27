import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Разрешенные домены
const allowedOrigins = [
  'https://the-x.shop',
  'http://localhost:3000'
];
// Получение CORS заголовков
const getCorsHeaders = (origin)=>{
  const isAllowed = origin && allowedOrigins.includes(origin);
  return {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Vary': 'Origin'
  };
};
// ================== CQRS HANDLERS ==================
// Команды (изменяют состояние)
const commandHandlers = {
  'send': handleSendMessage,
  'mark-read': handleMarkAsRead,
  'setup-webhook': handleSetupWebhook
};
// Запросы (получают данные)
const queryHandlers = {
  'messages': handleGetMessages,
  'status': handleStatus,
  'webhook-status': handleWebhookStatus
};
// ================== MAIN FUNCTION ==================
serve(async (req)=>{
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  // Обработка CORS preflight запросов
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400' // Кеширование на 24 часа
      }
    });
  }
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop() || '';
    // Определяем обработчик на основе CQRS
    let response;
    if (commandHandlers[action]) {
      response = await commandHandlers[action](req, supabase);
    } else if (queryHandlers[action]) {
      response = await queryHandlers[action](req, supabase);
    } else {
      return new Response(JSON.stringify({
        error: 'Invalid action'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Добавляем CORS заголовки к ответу
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders)){
      if (value) headers.set(key, value);
    }
    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        ...getCorsHeaders(req.headers.get('Origin')),
        'Content-Type': 'application/json'
      }
    });
  }
});
// ================== COMMAND HANDLERS ==================
async function handleSendMessage(req, supabase) {
  try {
    const { chatId, message, name = '', email = '' } = await req.json();
    if (!chatId || !message) {
      return new Response(JSON.stringify({
        error: 'Missing chatId or message'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Проверка существования сессии
    const { error: sessionCheckError } = await supabase.from('chat_sessions').select('id').eq('id', chatId).single();
    if (sessionCheckError && sessionCheckError.code === 'PGRST116') {
      // Создание новой сессии
      const { error: createSessionError } = await supabase.from('chat_sessions').insert({
        id: chatId,
        customer_name: name,
        customer_email: email
      });
      if (createSessionError) {
        return new Response(JSON.stringify({
          error: 'Failed to create chat session'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
    // Сохранение сообщения
    const { error: messageError } = await supabase.from('chat_messages').insert({
      chat_id: chatId,
      message: message,
      is_from_admin: false,
      is_read: false
    });
    if (messageError) {
      return new Response(JSON.stringify({
        error: 'Failed to save message'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Отправка в Telegram
    await sendToTelegramBot(chatId, message, name, email);
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to send message'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
async function handleMarkAsRead(req, supabase) {
  try {
    const { chatId } = await req.json();
    if (!chatId) {
      return new Response(JSON.stringify({
        error: 'Missing chatId'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const { error } = await supabase.from('chat_messages').update({
      is_read: true
    }).eq('chat_id', chatId).eq('is_from_admin', true);
    if (error) {
      return new Response(JSON.stringify({
        error: 'Failed to mark messages as read'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to mark as read'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
async function handleSetupWebhook(req, supabase) {
  try {
    const { url } = await req.json();
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramBotToken) {
      return new Response(JSON.stringify({
        error: 'No bot token configured'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url
      })
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
// ================== QUERY HANDLERS ==================
async function handleGetMessages(req, supabase) {
  try {
    const { chatId } = await req.json();
    if (!chatId) {
      return new Response(JSON.stringify({
        error: 'Missing chatId'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const { data: messages, error } = await supabase.from('chat_messages').select('*').eq('chat_id', chatId).order('created_at', {
      ascending: true
    });
    if (error) {
      return new Response(JSON.stringify({
        error: 'Failed to fetch messages'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      messages: messages || []
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to get messages'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
async function handleStatus(req, supabase) {
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const telegramAdminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return new Response(JSON.stringify({
    status: 'ok',
    config: {
      telegram_bot_token_set: !!telegramBotToken,
      telegram_admin_chat_id_set: !!telegramAdminChatId,
      supabase_url_set: !!supabaseUrl,
      supabase_service_role_key_set: !!supabaseServiceRoleKey
    }
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
async function handleWebhookStatus(req, supabase) {
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!telegramBotToken) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'No bot token configured'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getWebhookInfo`);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
// ================== HELPER FUNCTION ==================
async function sendToTelegramBot(chatId, message, name, email) {
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const telegramAdminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID');
  if (!telegramBotToken || !telegramAdminChatId) {
    return;
  }
  try {
    const telegramMessage = `
🔔 Новое сообщение от клиента

👤 **Имя:** ${name || 'Не указано'}
📧 **Email:** ${email || 'Не указан'}
🆔 **Chat ID:** ${chatId}

💬 **Сообщение:**
${message}

📝 Для ответа отправьте сообщение в формате:
Reply to chat ID: ${chatId}
Ваш ответ здесь...
    `.trim();
    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: telegramAdminChatId,
        text: telegramMessage,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
  }
}
