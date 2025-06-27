import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { getMessages, markMessagesAsRead } from '@/services/chatService';
import { useAuth } from '@/context/AuthContext';

export const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to fetch messages with safety checks
  const fetchMessages = useCallback(async () => {
    // Don't fetch if profile is not loaded or email is missing
    if (!profile || !profile.email) {
      return [];
    }

    setIsLoading(true);
    try {
      const newMessages = await getMessages(profile.email);
      if (newMessages && Array.isArray(newMessages)) {
        setMessages(newMessages);
        
        // Calculate unread count
        const unread = newMessages.filter(msg => !msg.is_read && !msg.is_from_admin).length;
        setUnreadCount(unread);
        
        return newMessages;
      }
      return [];
    } catch (error) {
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [profile]); // Add profile as dependency

  // Initial fetch on component mount or when profile loads
  useEffect(() => {
    if (profile?.email) {
      fetchMessages();
    }
  }, [fetchMessages, profile]);

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const markAsRead = async () => {
        try {
          await markMessagesAsRead();
          setUnreadCount(0);
          setMessages(prev => 
            prev.map(msg => ({ ...msg, is_read: true }))
          );
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };
      
      markAsRead();
    }
  }, [isOpen, unreadCount]);

  // Poll for new messages only when chat is active
  useEffect(() => {
    if (!profile?.email) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchMessages, profile]);

  return {
    messages,
    unreadCount,
    messagesEndRef,
    fetchMessages,
    isLoading
  };
};