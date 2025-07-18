import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types/chat";
import { API_BASE_URL } from "@/types/variables";

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


export const sendToTelegram = async (response: any): Promise<boolean> => {
  try {
      // Проверка структуры ответа
      if (!response || !response.success || !response.order) {
          console.error("Неверный формат ответа:", response);
          return false;
      }

      const order = response.order;

      // Проверка наличия товаров
      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
          console.error("Отсутствуют товары в заказе:", order);
          return false;
      }

      // Форматирование даты
      const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          });
      };

      // Формирование сообщения
      let message = `🛒 *Новый заказ #${order.order_number}*\n\n`;
      message += `📅 *Дата:* ${formatDate(order.created_at)}\n`;
      message += `👤 *Имя:* ${order.customer_name}\n`;
      message += `✉️ *Email:* ${order.customer_email || 'не указан'}\n`;
      message += `📱 *Телефон:* ${order.customer_phone}\n`;
      message += `🚚 *Способ доставки:* ${order.delivery_method}\n`;
      message += `🏠 *Адрес доставки:* ${order.delivery_address}\n\n`;
      message += `📦 *Товары:*\n`;

      // Обработка товаров
      order.items.forEach((item: any, index: number) => {
          const product = item.product;
          const sum = parseFloat(product.price) * item.quantity;
          
          message += `${index + 1}. *${product.title}*\n`;
          message += `   Артикул: ${product.article_number}\n`;
          message += `   Цена: ${parseFloat(product.price).toLocaleString('ru-RU')} ₽\n`;
          message += `   Кол-во: ${item.quantity}\n`;
          message += `   Сумма: ${sum.toLocaleString('ru-RU')} ₽\n\n`;
      });

      message += `💳 *Итого к оплате:* ${parseFloat(order.total).toLocaleString('ru-RU')} ₽\n`;
      message += `🟢 *Статус:* ${order.status === 'new' ? 'Новый' : order.status}`;

      console.log("Сформированное сообщение:", message);
      
      // Отправка сообщения (ваша реализация sendTelegramMessage)
      return await sendTelegramMessage(message, {
          name: order.customer_name,
          email: order.customer_email
      });
  } catch (error) {
      console.error("Ошибка при отправке уведомления:", error);
      return false;
  }
};

export const sendTelegramMessage = async (
  message: string,
  userInfo?: { name?: string; email?: string }
): Promise<boolean> => {
  try {
    const chatId = getChatId();
    const deviceInfo = getDeviceInfo();
 
    console.log("Отправка сообщения (заглушка):", message);
    console.log("Пользователь:", userInfo);
    console.log("Чат ID:", chatId);
    console.log("Устройство:", deviceInfo);

    const url = `https://api.telegram.org/bot8139116930:AAHDuUQt4P1exwlEby24VC1nmSmDMAu6SUg/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: 342722215,
        text: message
      })
    });

    if (!response.ok) {
      console.error('Ошибка HTTP при отправке в Telegram:', response.status, await response.text());
      return false;
    }

    const data = await response.json();
    if (!data.ok) {
      console.error('Ошибка Telegram API:', data);
      return false;
    }
    console.log('Ответ Telegram:', data);
    return true;
  } catch (error) {
    console.error('Ошибка в sendTelegramMessage:', error);
    return false;
  }
};

export const sendMessage = async (
  userId: string,
  text: string,
  senderId?: string
): Promise<ChatMessage | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, senderId }),
    });
    if (!response.ok) {
      console.error('Ошибка при отправке сообщения:', response.status, await response.text());
      return null;
    }
    const data = await response.json();
    return {
      id: data.id,
      chat_id: userId,
      message: data.text,
      is_from_admin: data.senderId === 'admin',
      is_read: data.is_read ?? false,
      created_at: data.createdAt,
    };
  } catch (error) {
    console.error("Ошибка в sendMessage:", error);
    return null;
  }
};

export const getUnreadMessagesCount = async (userId: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/unread-count`);
    if (!response.ok) {
      console.error('Ошибка при получении непрочитанных сообщений:', response.status, await response.text());
      return 0;
    }
    const data = await response.json();
    return data.unreadCount || 0;
  } catch (error) {
    console.error("Ошибка в getUnreadMessagesCount:", error);
    return 0;
  }
};

export const getChatHistory = async (userId : string): Promise<ChatMessage[]> => {
  try {
    const chatId = getChatId();
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/history`);
    if (!response.ok) {
      console.error('Ошибка при получении истории сообщений:', response.status, await response.text());
      return [];
    }
    const data = await response.json();
    return data.map((msg: any) => ({
      id: msg.id,
      chat_id: chatId,
      message: msg.text,
      is_from_admin: msg.isAdmin || msg.is_from_admin || msg.senderId === 'admin',
      is_read: msg.is_read ?? true,
      created_at: msg.createdAt || msg.created_at
    }));
  } catch (error) {
    console.error("Ошибка в getChatHistory:", error);
    return [];
  }
};

export const markAllMessagesAsRead = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/mark-all-read`, {
      method: 'POST',
    });
    if (!response.ok) {
      console.error('Ошибка при отметке всех сообщений как прочитанных:', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Ошибка в markAllMessagesAsRead:", error);
    return false;
  }
};

export const checkTelegramWebhookStatus = async (): Promise<any> => {
  console.log("Проверка статуса webhook (заглушка)");
  return { ok: false };
};

export const checkChatStatus = async (): Promise<{
  ok: boolean;
  config?: {
    telegram_bot_token_set: boolean;
    telegram_admin_chat_id_set: boolean;
    supabase_url_set: boolean;
    supabase_service_role_key_set: boolean;
  };
}> => {
  console.log("Проверка статуса чата (заглушка)");
  return {
    ok: false,
    config: {
      telegram_bot_token_set: false,
      telegram_admin_chat_id_set: false,
      supabase_url_set: false,
      supabase_service_role_key_set: false
    }
  };
};

export const pollForNewMessages = async (
  lastMessageId: number | null,
  callback: (messages: ChatMessage[]) => void
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/poll?lastMessageId=${lastMessageId || ''}`);
    if (!response.ok) {
      console.error('Ошибка при опросе новых сообщений:', response.status, await response.text());
      return;
    }
    const newMessages = await response.json();
    if (newMessages && newMessages.length > 0) {
      callback(newMessages);
    }
  } catch (error) {
    console.error("Ошибка в pollForNewMessages:", error);
  }
};

export const setupTelegramWebhook = async (url: string): Promise<boolean> => {
  console.log("Настройка webhook (заглушка) для URL:", url);
  return false;
};

export const syncChatAcrossDevices = async (): Promise<void> => {
  const chatId = getChatId();
  console.log("Синхронизация чата между устройствами (заглушка) для ID:", chatId);
};


export const getMessages = async (userId : string): Promise<ChatMessage[]> => {
  try {
    const chatId = getChatId();
    // Запрос к backend API для получения истории сообщений
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/history`);
    if (!response.ok) {
      console.error('Ошибка при получении сообщений:', response.status, await response.text());
      return [];
    }
    const data = await response.json();
    // Маппинг структуры ответа к ChatMessage
    return data.map((msg: any) => ({
      id: msg.id,
      chat_id: chatId,
      message: msg.text, // или msg.message если поле так называется
      is_from_admin: msg.isAdmin || msg.is_from_admin || msg.senderId === 'admin',
      is_read: msg.is_read ?? true, // если нет поля, считаем true
      created_at: msg.createdAt || msg.created_at
    }));
  } catch (error) {
    console.error("Ошибка в getMessages:", error);
    return [];
  }
};
