import React, { useEffect, useState, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatMessage } from '@/types/chat';
import { sendMessage } from '@/services/chatService';
import { useAuth } from '@/context/AuthContext'; // Добавляем useAuth сюда

const ChatWidget: React.FC = () => {
  const { profile } = useAuth(); // Получаем профиль здесь
  const [isOpen, setIsOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { messages, unreadCount, messagesEndRef, fetchMessages } = useChatMessages(isOpen);

  // Синхронизация сообщений
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Оптимизированный обработчик отправки
  const handleSend = useCallback(async (messageText: string) => {
    if (!profile) return; // Проверяем наличие профиля
    
    // Мгновенное обновление UI с использованием startTransition
    const tempId = -Date.now(); // Сохраняем ID для последующего удаления
    startTransition(() => {
      const tempMessage: ChatMessage = {
        id: tempId,
        chat_id: 'temp-chat-id',
        message: messageText,
        is_from_admin: false,
        is_read: true,
        created_at: new Date().toISOString(),
      };
      
      setLocalMessages(prev => [...prev, tempMessage]);
    });
    
    setIsSending(true);
    
    try {
      // Асинхронная отправка без блокировки UI
      await sendMessage(
        messageText, 
        profile   // Передаем имя из профиля
      );
      
      // Обновляем данные
      await fetchMessages();
    } catch (error) {
      // Откат в случае ошибки
      startTransition(() => {
        setLocalMessages(prev => prev.filter(msg => msg.id !== tempId));
      });
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  }, [profile, fetchMessages]); // Добавляем profile в зависимости

  return (
    <>
      {isOpen ? (
        <ChatWindow
          messages={localMessages}
          onClose={handleToggleChat}
          onSendMessage={handleSend}
          isSending={isSending}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <Button
          onClick={handleToggleChat}
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-40 bg-white border-2"
          aria-label="Открыть чат"
        >
          <MessageSquare />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}
    </>
  );
};

export default ChatWidget;