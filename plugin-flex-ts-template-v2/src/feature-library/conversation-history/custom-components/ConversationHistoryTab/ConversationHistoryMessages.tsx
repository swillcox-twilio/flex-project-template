import { useState, useEffect } from 'react';
import { Icon, withTaskContext } from '@twilio/flex-ui';
import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  ChatAttachment,
  ChatAttachmentLink,
  ChatAttachmentDescription,
} from '@twilio-paste/chat-log';

import ConversationHistoryService from '../../utils/ConversationHistoryService';
import { MessageTrimmed, Media } from '../../types';

interface MyProps {
  conversationSid: string;
}

const ConversationHistoryMessages = ({ conversationSid }: MyProps) => {
  const [messages, setMessages] = useState([] as Array<MessageTrimmed>);
  useEffect(() => {
    ConversationHistoryService.fetchConversationMessages(conversationSid).then((messages) => {
      setMessages(Array.from(messages));
    });
  }, [conversationSid]);
  return (
    <ChatLog>
      {messages?.map((message) => {
        const dateTime: string = message.dateCreated;
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (
          message.author.startsWith('whatsapp:') ||
          message.author.startsWith('+') ||
          uuidPattern.test(message.author) ||
          message.author === 'Virtual Assistant'
        ) {
          return (
            <ChatMessage variant="inbound" key={message.index}>
              <ChatBubble>{message.body}</ChatBubble>
              {message.media?.map((media: Media, index: React.Key) => {
                if (!media) {
                  return null;
                }
                let filename = media.filename;
                let content_type = media.content_type;
                if (!filename) {
                  filename = 'undefined';
                }
                if (!content_type) {
                  content_type = 'undefined';
                }
                return (
                  <ChatBubble key={index}>
                    <ChatAttachment attachmentIcon={<Icon icon="Whatsapp" />}>
                      <ChatAttachmentLink href="#">{filename}</ChatAttachmentLink>
                      <ChatAttachmentDescription>{content_type}</ChatAttachmentDescription>
                    </ChatAttachment>
                  </ChatBubble>
                );
              })}
              <ChatMessageMeta aria-label="customer">
                <ChatMessageMetaItem>
                  {message.author} ・ {dateTime.slice(0, 24)}
                </ChatMessageMetaItem>
              </ChatMessageMeta>
            </ChatMessage>
          );
        }

        let author = message.author;
        if (author === conversationSid) {
          author = 'Virtual Agent';
        }

        return (
          <ChatMessage variant="outbound" key={message.index}>
            <ChatBubble>{message.body}</ChatBubble>
            {message.media?.map((media: Media, index: React.Key) => {
              if (!media) {
                return null;
              }
              let filename = media.filename;
              let content_type = media.content_type;
              if (!filename) {
                filename = 'undefined';
              }
              if (!content_type) {
                content_type = 'undefined';
              }
              return (
                <ChatBubble key={index}>
                  <ChatAttachment attachmentIcon={<Icon icon="Whatsapp" />}>
                    <ChatAttachmentLink href="#">{filename}</ChatAttachmentLink>
                    <ChatAttachmentDescription>{content_type}</ChatAttachmentDescription>
                  </ChatAttachment>
                </ChatBubble>
              );
            })}
            <ChatMessageMeta aria-label="agent">
              <ChatMessageMetaItem>
                {author} ・ {dateTime.slice(0, 24)}
              </ChatMessageMetaItem>
            </ChatMessageMeta>
          </ChatMessage>
        );
      })}
    </ChatLog>
  );
};

export default withTaskContext(ConversationHistoryMessages);
