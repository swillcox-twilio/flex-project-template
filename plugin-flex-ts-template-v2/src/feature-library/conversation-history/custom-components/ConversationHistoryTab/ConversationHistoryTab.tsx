import { useState, useEffect } from 'react';
import { Button, ITask, Icon, withTaskContext } from '@twilio/flex-ui';
import { Disclosure, DisclosureHeading, DisclosureContent } from '@twilio-paste/core/disclosure';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/core/text';
import { Input } from '@twilio-paste/core/input';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

import { ConversationTrimmed } from '../../types';
import ConversationHistoryMessages from './ConversationHistoryMessages';
import ConversationHistoryService from '../../utils/ConversationHistoryService';

interface MyProps {
  task?: ITask;
}

const ConversationHistoryTab = ({ task }: MyProps) => {
  if (!task) {
    return null;
  }
  const [phoneNumber] = useState(task?.attributes.from);
  const [conversations, setConversations] = useState([] as Array<ConversationTrimmed>);
  // initial render
  useEffect(() => {
    ConversationHistoryService.fetchConversationsByParticipant(phoneNumber).then((result) => {
      setConversations(Array.from(result));
    });
  }, [phoneNumber]);
  return (
    <>
      <Box padding="space20" width="100vw">
        {conversations.map((conversation, index) => {
          const dateTime: string = conversation.conversationDateCreated;
          if (conversation.conversationSid === task?.attributes.conversationSid) {
            return null;
          }
          // define the icon based on the channel
          let channelIcon;
          switch (conversation.conversationOriginalChannel) {
            case 'whatsapp':
              channelIcon = <Icon icon="Whatsapp" />;
              break;
            case 'sms':
              channelIcon = <Icon icon="Sms" />;
              break;
            default:
              channelIcon = <Icon icon="Message" />;
          }
          return (
            <Disclosure key={conversation.conversationSid}>
              <DisclosureHeading as="h2" variant="heading50" key={conversation.conversationSid}>
                {channelIcon}
                {dateTime.slice(0, 24)}{' '}
                <Text color="colorTextWeak" fontSize="fontSize20" marginRight="space30" as="span">
                  {' '}
                  ({conversation.conversationState})
                </Text>
              </DisclosureHeading>
              <DisclosureContent key={index}>
                <ConversationHistoryMessages conversationSid={conversation.conversationSid} />
              </DisclosureContent>
            </Disclosure>
          );
        })}
      </Box>
    </>
  );
};

export default withTaskContext(ConversationHistoryTab);
