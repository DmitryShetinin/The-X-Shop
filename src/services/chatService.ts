import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types/chat";
import { TELEGRAM_TOKEN } from "@/types/variables";

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
      
      // Отправка сообщения (ваша реализация sendMessage)
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
 
    // Все импорты supabase и вызовы supabase.functions.invoke удалены
    // Временные заглушки:
    console.log("Отправка сообщения (заглушка):", message);
    console.log("Пользователь:", userInfo);
    console.log("Чат ID:", chatId);
    console.log("Устройство:", deviceInfo);

    // Формируем текст сообщения (добавим userInfo, если есть)
  

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
    console.error('Ошибка в sendMessage:', error);
    return false;
  }
};

// Получение истории сообщений
export const getMessages = async (): Promise<ChatMessage[]> => {
  try {
    const chatId = getChatId();
    console.log("Получение сообщений для chat ID:", chatId);
      
    console.log("=============================================")
    console.log('GOOGLE_CLIENT_ID:', process.env)
    // Все импорты supabase и вызовы supabase.functions.invoke удалены
    // Временные заглушки:
    console.log("Получение сообщений (заглушка) для chat ID:", chatId);
    return []; // Заглушка
  } catch (error) {
    console.error("Ошибка в getMessages:", error);
    return [];
  }
};

// Отметка сообщений как прочитанных
export const markMessagesAsRead = async (): Promise<boolean> => {
  try {
    const chatId = getChatId();
    
    // Все импорты supabase и вызовы supabase.functions.invoke удалены
    // Временные заглушки:
    console.log("Отметка сообщений как прочитанных (заглушка) для chat ID:", chatId);
    return true; // Заглушка
  } catch (error) {
    console.error("Ошибка в markMessagesAsRead:", error);
    return false;
  }
};

// Проверка статуса webhook Telegram
export const checkTelegramWebhookStatus = async (): Promise<any> => {
  try {
    // Все импорты supabase и вызовы supabase.functions.invoke удалены
    // Временные заглушки:
    console.log("Проверка статуса webhook (заглушка)");
    return { ok: false }; // Заглушка
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
 
    // Все импорты supabase и вызовы supabase.functions.invoke удалены
    // Временные заглушки:
    console.log("Проверка статуса чата (заглушка)");
    return { 
      ok: false, // Заглушка
      config: {
        telegram_bot_token_set: false,
        telegram_admin_chat_id_set: false,
        supabase_url_set: false,
        supabase_service_role_key_set: false
      } // Заглушка
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
    // Все импорты supabase и вызовы supabase.functions.invoke удалены
    // Временные заглушки:
    console.log("Настройка webhook (заглушка) для URL:", url);
    return false; // Заглушка
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
    
    // Все импорты supabase и вызовы supabase.functions.invoke удалены
    // Временные заглушки:
    console.log("Синхронизация чата между устройствами (заглушка) для ID:", chatId);
  } catch (error) {
    console.error("Ошибка в syncChatAcrossDevices:", error);
  }
};
