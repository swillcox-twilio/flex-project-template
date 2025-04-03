import * as Flex from '@twilio/flex-ui';

import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';
import ConversationHistoryService from '../../utils/ConversationHistoryService';

export const actionEvent = FlexActionEvent.replace;
export const actionName = FlexAction.WrapupTask;
export const actionHook = function addParticipantOnWrapup(flex: typeof Flex, _manager: Flex.Manager) {
  // alter wrap-up to add address to chat interactions so they can be found
  flex.Actions.replaceAction(FlexAction.WrapupTask, async (payload, original) => {
    // Only alter chat tasks, skip others
    if (payload.task.taskChannelUniqueName !== 'chat' || payload.task.attributes.from.startsWith('whatsapp:')) {
      original(payload);
    } else {
      await ConversationHistoryService.addParticipantToConversation(
        payload.task.attributes.conversationSid,
        payload.task.attributes.from,
      );
      original(payload);
    }
  });
};
