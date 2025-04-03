const { prepareFlexFunction, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const requiredParameters = [
  { key: 'conversationSid', purpose: 'Sid of the Conversation to Add the Participcant' },
  { key: 'address', purpose: 'address of participant to add' },
];

/* This function is used to add a participant to a conversation before we close it,
 * so that the live chat session can be surfaced on the previous chat conversations
 */
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { conversationSid, address } = event;
  try {
    // need to check if this is a phone number, otherwise we might invoke this with a chat identity
    if (!address.startsWith('+')) {
      console.log('the address (phone number) provided does not start with a +. Address provided: ', address);
      return callback(null, response);
    }
    const data = await twilioExecute(context, (client) => {
      client.conversations.v1.conversations(conversationSid).participants.create({
        'messagingBinding.address': address,
      });
    });
    response.setBody({ ...data });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
