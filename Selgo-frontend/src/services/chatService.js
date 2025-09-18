const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8002/api/v1';

import { apiClient } from './authService';

const chatService = {
  createConversation: async (participantIds, itemId = null) => {
    try {
      const response = await apiClient.post('/chats/conversations', {
        participant_ids: participantIds,
        item_id: itemId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  getConversations: async () => {
    try {
      const response = await apiClient.get('/chats/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  getMessages: async (conversationId) => {
    try {
      const response = await apiClient.get(`/chats/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  connectWebSocket: (conversationId, userId, onMessageCallback) => {
    const wsUrl = (process.env.NEXT_PUBLIC_CHAT_API_URL || 'ws://localhost:8004/api/v1').replace('http', 'ws');
    const ws = new WebSocket(`${wsUrl}/chats/ws/${conversationId}/${userId}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessageCallback(message);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  },
};

export default chatService;
