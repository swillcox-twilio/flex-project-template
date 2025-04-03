type MessageVariants = 'inbound' | 'outbound';
export interface MessageTrimmed {
  index: string;
  author: string;
  body: string;
  media: any;
  dateCreated: string;
}
export interface Message {
  index: number;
  direction: MessageVariants;
  date: string;
  author: string;
  body: string;
}
export interface Conversation {
  conversationOriginalChannel: string;
  conversationSid: string;
  conversationDateCreated: Date;
  conversationState: string;
  from: string;
  messages: Message[];
}
export interface ConversationTrimmed {
  conversationSid: string;
  conversationDateCreated: string;
  conversationOriginalChannel: string;
  conversationState: string;
}
export interface Media {
  filename: string;
  content_type: string;
  size: BigInteger;
}
