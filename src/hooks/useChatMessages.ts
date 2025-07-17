
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { getMessages } from '@/services/chatService';
import { useAuth } from '@/context/AuthContext';
import { WS_BASE_URL, API_BASE_URL } from '@/types/variables';

export const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();

  // Helper function to fetch messages from backend (initial load)
  const fetchMessages = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const msgs = await getMessages(user.id.toString());
      setMessages(msgs);
      // Count unread messages from admin
      const newUnreadCount = msgs.filter(m => m.is_from_admin && !m.is_read).length;
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  // WebSocket setup
  useEffect(() => {
    if (!user || !user.id) return;
    
    const ws = new WebSocket(`${WS_BASE_URL}/chat/user/${user.id}`);

    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
       
        const userId = msg.user_id || msg.userId;
        const chatId = msg.chat_id || msg.chatId;
        
        if (userId === user.id || chatId === user.id) {
         
          setMessages(prev => {
            const newMsg = {
              id: msg.id?.toString() || msg._id?.toString() || Date.now().toString(),
              chat_id: chatId ? chatId.toString() : userId ? userId.toString() : '',
              message: msg.text || msg.message || '',
              is_from_admin: (msg.sender_id === 'admin'),
              is_read: true,
              created_at: msg.created_at || msg.createdAt || new Date().toISOString()
            };
            if (prev.some(m => m.id === newMsg.id)) {
 
              return prev;
            }
           
            return [...prev, newMsg];
          });
        } else {
          console.log('[WS] Сообщение не для этого пользователя, игнорируем');
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    };

    ws.onopen = () => {
      fetchUnreadCount(); // Вызываем fetchUnreadCount при открытии WebSocket
    };

    ws.onclose = () => {
      wsRef.current = null;
    };
    
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => ws.close();
  }, [user]);

  // Initial fetch on mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Send message
  const sendMessage = async (text: string) => {
    if (!user || !user.id) return;
    const tempId = -Math.abs(Date.now()); // Уникальный временный ID (number)
    const now = new Date().toISOString();

    // Оптимистично добавляем сообщение в UI
    setMessages(prev => [
      ...prev,
      {
        id: tempId, // ID теперь число
        chat_id: String(user.id),
        message: text,
        is_from_admin: false,
        is_read: true,
        created_at: now
      } as ChatMessage // Явно приводим к типу ChatMessage
    ]);

    const msgObj = {
      type: 'message',
      text,
      userId: user.id
    };

    try {
      // Помечаем отправку сообщения как in_progress, если нужно для UI
      // setIsSending(true); 

      // Try WebSocket first
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(msgObj));
      } else {
        await fetch(`${API_BASE_URL}/chat/${user.id}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msgObj) // Отправляем весь msgObj в теле запроса
        });
      }
    } catch (error) {
      // Откатываем UI при ошибке: удаляем оптимистичное сообщение
      setMessages(prev => prev.filter(m => m.id !== tempId));
      console.error('Error sending message:', error);
      // Возможно, добавить тост об ошибке для пользователя
    } finally {
      // setIsSending(false); // Сбрасываем статус отправки
    }
  };

  return {
    messages,
    unreadCount,
    messagesEndRef,
    sendMessage
  };
};