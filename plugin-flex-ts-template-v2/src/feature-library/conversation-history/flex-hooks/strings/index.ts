// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ConversationHistoryHeader = 'PSConversationHistoryHeader',
  ConversationHistorySearchLabel = 'PSConversationHistorySearchLabel',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ConversationHistoryHeader]: 'Conversation History',
    [StringTemplates.ConversationHistorySearchLabel]: 'Search',
  },
});
