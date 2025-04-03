import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import logger from '../../../utils/logger';
import { Message, Conversation, ConversationTrimmed, MessageTrimmed } from '../types';

class ConversationHistoryService extends ApiService {
  fetchHistory = async (contactAddress: string): Promise<Message[]> => {
    const encodedParams: EncodedParams = {
      contactAddress: encodeURIComponent(contactAddress),
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      const historyResponse = await this.fetchJsonWithReject<Message[]>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-history/flex/fetch-history`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      const messages: Message[] = Object.values(historyResponse);
      return messages.sort((a, b) => {
        return Date.parse(b.date) - Date.parse(a.date);
      });
    } catch (error: any) {
      logger.error(`[conversation-history] Error fetching history for ${contactAddress}\r\n`, error);
      throw error;
    }
  };

  fetchConversationsByParticipant = async (phoneNumber: string): Promise<ConversationTrimmed[]> => {
    const encodedParams: EncodedParams = {
      phoneNumber: encodeURIComponent(phoneNumber),
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      const conversationResponse = await this.fetchJsonWithReject<ConversationTrimmed[]>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-history/flex/fetchAllConversationsByParticipant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      const conversations: ConversationTrimmed[] = Object.values(conversationResponse);
      return conversations;
    } catch (error: any) {
      logger.error(`[conversation-history] Error fetching history for ${phoneNumber}\r\n`, error);
      throw error;
    }
  };

  fetchConversationMessages = async (conversationSid: string) => {
    const encodedParams: EncodedParams = {
      conversationSid: encodeURIComponent(conversationSid),
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      const conversationResponse = await this.fetchJsonWithReject<MessageTrimmed[]>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-history/flex/fetchConversationMessages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      const messages: MessageTrimmed[] = Object.values(conversationResponse);
      return messages;
    } catch (error: any) {
      logger.error(`[conversation-history] Error fetching messages for conversation: ${conversationSid}\r\n`, error);
      throw error;
    }
  };

  addParticipantToConversation = async (conversationSid: string, address: string) => {
    const encodedParams: EncodedParams = {
      conversationSid: encodeURIComponent(conversationSid),
      address: encodeURIComponent(address),
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      const addParticipantResponse = await this.fetchJsonWithReject<MessageTrimmed[]>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-history/flex/addParticipantToConversation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      const messages: MessageTrimmed[] = Object.values(addParticipantResponse);
      return messages;
    } catch (error: any) {
      logger.error(`[conversation-history] Error fetching messages for conversation: ${conversationSid}\r\n`, error);
      throw error;
    }
  };
}

export default new ConversationHistoryService();
