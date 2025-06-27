import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types/chat";

// Получение или создание ID чата с улучшенной идентификацией
let cachedChatId: string | null = null;

/**
 * Безопасное получение ID чата с поддержкой множественных устройств
 */
export const getChatId = (): string => {
  if (cachedChatId) {
    return cachedChatId;
  }

  try {
    // Пытаемся получить ID из localStorage
    const stored = typeof localStorage !== "undefined"
      ? localStorage.getItem("chat_id")
      : null;

    if (stored) {
      cachedChatId = stored;
    } else {
      // Генерируем новый уникальный ID
      cachedChatId = `chat_${Date.now()}_${uuidv4()}`;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("chat_id", cachedChatId);
      }
    }
  } catch (error) {
    console.error("Ошибка доступа к localStorage для chat_id:", error);
    if (!cachedChatId) {
      cachedChatId = `chat_${Date.now()}_${uuidv4()}`;
    }
  }

  return cachedChatId;
};

// Получение информации об устройстве для лучшей идентификации
const getDeviceInfo = () => {
  try {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  } catch (error) {
    return {};
  }
};

interface OrderItem {
  price: number;
  quantity: number;
  productId: string;
  productName: string;
  articleNumber: string;
}

interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[]; // Важно: это массив объектов
  total: number;
  status: string;
  delivery_address: string;
  delivery_method: string;
  created_at: string;
  updated_at: string;
  order_number: number;
  tracking_number: string | null;
  tracking_url: string | null;
  source: string;
}
export const sendOrderNotification = async (response: any): Promise<boolean> => {
  try {
    // Проверяем структуру ответа
    if (!response || !response.success || !response.order) {
      console.error("Неверный формат ответа:", response);
      return false;
    }
    
    // Извлекаем реальный объект заказа
    const order = response.order;
    
    // Теперь работаем с order
    console.log("Извлеченные данные заказа:", JSON.stringify(order, null, 2));
    
    // Проверяем наличие товаров
    if (!order.items || !Array.isArray(order.items)) {
      console.error("Отсутствуют товары в заказе:", order);
      return false;
    }

    // Форматирование даты
    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleString("ru-RU");
      } catch {
        return "Неизвестная дата";
      }
    };

    // Формируем сообщение
    let message = `🛒 *Новый заказ #${order.order_number}*\n\n`;
    message += `📅 *Дата:* ${formatDate(order.created_at)}\n`;
    message += `👤 *Имя:* ${order.customer_name}\n`;
    message += `✉️ *Email:* ${order.customer_email}\n`;
    message += `📱 *Телефон:* ${order.customer_phone}\n`;
    message += `🏠 *Адрес доставки:* ${order.delivery_address}\n\n`;
    message += `📦 *Товары:*\n`;

    // Перебираем товары
    order.items.forEach((item, index) => {
      message += `${index + 1}. *${item.productName}*\n`;
      message += `   Артикул: ${item.articleNumber}\n`;
      message += `   Цена: ${item.price.toLocaleString("ru-RU")} ₽\n`;
      message += `   Количество: ${item.quantity}\n`;
      message += `   Сумма: ${(item.price * item.quantity).toLocaleString("ru-RU")} ₽\n\n`;
    });

    message += `💳 *Итого к оплате:* ${order.total.toLocaleString("ru-RU")} ₽`;

    console.log("Сформированное сообщение:", message);
    
    // Отправляем сообщение
    return await sendMessage(message, {
      name: order.customer_name,
      email: order.customer_email
    });
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
    return false;
  }
};


export const sendMessage = async (
  message: string,
  userInfo?: { name?: string; email?: string }
): Promise<boolean> => {
  try {
    const chatId = getChatId();
    const deviceInfo = getDeviceInfo();
 
    const response = await supabase.functions.invoke("telegram-chat/send", {
      body: { 
        chatId, 
        message,
        parse_mode: "MarkdownV2", // Добавляем поддержку Markdown
        name: userInfo?.name || '', 
        email: userInfo?.email || '',
        deviceInfo,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer || 'direct'
      },
    });
    
    if (response.error) {
      console.error("Ошибка отправки сообщения:", response.error);
      return false;
    }
    
    if (response.data && response.data.error) {
      console.error("Ошибка функции:", response.data.error, response.data.details);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Ошибка в sendMessage:", error);
    return false;
  }
};

// Получение истории сообщений
export const getMessages = async (): Promise<ChatMessage[]> => {
  try {
    const chatId = getChatId();
    console.log("Получение сообщений для chat ID:", chatId);
    
    const response = await supabase.functions.invoke("telegram-chat/messages", {
      body: { chatId },
    });
    
    if (response.error) {
      console.error("Ошибка получения сообщений:", response.error);
      return [];
    }
    
    if (response.data && response.data.error) {
      console.error("Ошибка функции:", response.data.error);
      return [];
    }
    
    console.log("Получены сообщения:", response.data?.messages || []);
    return response.data?.messages || [];
  } catch (error) {
    console.error("Ошибка в getMessages:", error);
    return [];
  }
};

// Отметка сообщений как прочитанных
export const markMessagesAsRead = async (): Promise<boolean> => {
  try {
    const chatId = getChatId();
    
    const response = await supabase.functions.invoke("telegram-chat/mark-read", {
      body: { chatId },
    });
    
    if (response.error) {
      console.error("Ошибка отметки сообщений как прочитанных:", response.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Ошибка в markMessagesAsRead:", error);
    return false;
  }
};

// Проверка статуса webhook Telegram
export const checkTelegramWebhookStatus = async (): Promise<any> => {
  try {
    const response = await supabase.functions.invoke("telegram-chat/webhook-status", {});
    
    if (response.error) {
      console.error("Ошибка проверки статуса webhook:", response.error);
      return { ok: false };
    }
    
    return response.data || {};
  } catch (error) {
    console.error("Ошибка в checkTelegramWebhookStatus:", error);
    return { ok: false };
  }
};

// Проверка состояния функции telegram-chat
export const checkChatStatus = async (): Promise<{
  ok: boolean;
  config?: {
    telegram_bot_token_set: boolean;
    telegram_admin_chat_id_set: boolean;
    supabase_url_set: boolean;
    supabase_service_role_key_set: boolean;
  };
}> => {
  try {
 
    const response = await supabase.functions.invoke("telegram-chat/status", {});
    
    if (response.error) {
      console.error("Ошибка проверки статуса чата:", response.error);
      return { ok: false };
    }
    
    return { 
      ok: response.data?.status === "ok",
      config: response.data?.config 
    };
  } catch (error) {
    console.error("Ошибка в checkChatStatus:", error);
    return { ok: false };
  }
};

// Проверка на наличие новых сообщений
export const pollForNewMessages = async (
  lastMessageId: number | null,
  callback: (messages: ChatMessage[]) => void
): Promise<void> => {
  try {
    const messages = await getMessages();
    
    if (messages.length === 0) return;
    
    const latestMessageId = Math.max(...messages.map(m => m.id));
    
    if (lastMessageId === null || latestMessageId > lastMessageId) {
      callback(messages);
    }
  } catch (error) {
    // Ошибка опроса сообщений (console.error удалён)
  }
};

// Настройка webhook для Telegram
export const setupTelegramWebhook = async (url: string): Promise<boolean> => {
  try {
    const response = await supabase.functions.invoke("telegram-chat/setup-webhook", {
      body: { url },
    });

    if (response.error || (response.data && response.data.error)) {
      console.error("Ошибка настройки webhook:", response.error || response.data.error);
      return false;
    }

    return !!response.data?.success;
  } catch (error) {
    console.error("Ошибка в setupTelegramWebhook:", error);
    return false;
  }
};

// Синхронизация чата между устройствами
export const syncChatAcrossDevices = async (): Promise<void> => {
  try {
    const chatId = getChatId();
    console.log("Синхронизация чата между устройствами для ID:", chatId);
    
    // Обновляем последнюю активность для данного чата
    const response = await supabase.functions.invoke("telegram-chat/sync", {
      body: { 
        chatId,
        lastActive: new Date().toISOString(),
        deviceInfo: getDeviceInfo()
      },
    });
    
    if (response.error) {
      console.error("Ошибка синхронизации чата:", response.error);
    }
  } catch (error) {
    console.error("Ошибка в syncChatAcrossDevices:", error);
  }
};
