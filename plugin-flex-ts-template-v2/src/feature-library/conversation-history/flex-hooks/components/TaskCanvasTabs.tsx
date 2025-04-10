import * as Flex from '@twilio/flex-ui';
import { Tab, TaskHelper } from '@twilio/flex-ui';
import { CustomizationProvider } from '@twilio-paste/core/dist/customization';

import { FlexComponent } from '../../../../types/feature-loader';
import { isFeatureEnabled } from '../../config';
import ConversationHistoryTab from '../../custom-components/ConversationHistoryTab/ConversationHistoryTab';

interface Props {
  task: Flex.ITask;
}
export const componentName = FlexComponent.TaskInfoPanel;
export const componentHook = function addHistoryToTaskInfoPanel(flex: typeof Flex) {
  if (!isFeatureEnabled()) return;
  Flex.setProviders({
    PasteThemeProvider: CustomizationProvider,
  });

  flex.TaskCanvasTabs.Content.add(
    <Tab label="History" key="conversation-history-tab" uniqueName="ConversationHistory">
      <ConversationHistoryTab key="conversation-history-tab-content" />
    </Tab>,
    { if: ({ task }: Props) => TaskHelper.isCBMTask(task) && task.status === 'accepted' },
  );
};
