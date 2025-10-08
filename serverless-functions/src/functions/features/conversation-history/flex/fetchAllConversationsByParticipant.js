const { identity } = require('lodash');

const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'phoneNumber', purpose: 'Address to retreive conversations' }];

// Helper Functions
const getAgedDate = (monthsAgo) => {
  const d = new Date(); // Current date
  d.setMonth(d.getMonth() - monthsAgo);
  return d;
};

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const MAX_CONVERSATIONS_TO_FETCH = 1000;
  const MAX_CONVERSATIONS_TO_PRESENT = 20;
  const MAX_PERIOD = 12; // months
  const { phoneNumber } = event;

  try {
    const smsAddress = phoneNumber.replace('whatsapp:', '');
    const whatsappAddress = `whatsapp:${smsAddress}`;

    const startDate = getAgedDate(MAX_PERIOD);

    // Fetch conversations with phone number, from aged date
    const conversationsListNumber = await twilioExecute(context, (client) => {
      return client.conversations.v1.participantConversations.list({
        address: smsAddress,
        startDate,
        limit: MAX_CONVERSATIONS_TO_FETCH,
      });
    });

    // Fetch conversations with whatsapp number, from aged date
    const conversationsListWA = await twilioExecute(context, (client) => {
      return client.conversations.v1.participantConversations.list({
        address: whatsappAddress,
        startDate,
        limit: MAX_CONVERSATIONS_TO_FETCH,
      });
    });

    // Fetch conversations with chat user number, from aged date smsAddress will be the identiy for these
    const conversationsListChat = await twilioExecute(context, (client) => {
      return client.conversations.v1.participantConversations.list({
        identity: smsAddress,
        startDate,
        limit: MAX_CONVERSATIONS_TO_FETCH,
      });
    });

    // Combine conversation lists and sort by date created
    let conversationsList = conversationsListNumber.data.concat(conversationsListWA.data);
    conversationsList = conversationsList.concat(conversationsListChat.data);
    // remove those that are not to be presented
    if (MAX_CONVERSATIONS_TO_FETCH > MAX_CONVERSATIONS_TO_PRESENT) {
      conversationsList.splice(MAX_CONVERSATIONS_TO_PRESENT, MAX_CONVERSATIONS_TO_FETCH - MAX_CONVERSATIONS_TO_PRESENT);
    }
    conversationsList.sort((a, b) => new Date(b.conversationDateCreated) - new Date(a.conversationDateCreated));
    const result = [];
    // create a result object with the information we want to supply
    for await (const conversation of conversationsList) {
      // this will identify whatsapps as whatsapp, sms and chat as sms (because we're adding a messaging binding to chats)
      let originalChannel = conversation.participantMessagingBinding.type;

      // if the proxy comes out null, it was originally a chat
      if (originalChannel === 'sms' && !conversation.participantMessagingBinding.proxy_address) {
        originalChannel = 'chat';
      }
      const convo = JSON.parse(`{
        "conversationOriginalChannel": "${originalChannel}",
        "conversationSid": "${conversation.conversationSid}", 
        "conversationDateCreated": "${conversation.conversationDateCreated}",
        "conversationState": "${conversation.conversationState}",
        "from": "${conversation.participantMessagingBinding.address}"
        }`);
      result.push(convo);
    }
    response.setBody({ ...result });
    response.setStatusCode(200);
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
