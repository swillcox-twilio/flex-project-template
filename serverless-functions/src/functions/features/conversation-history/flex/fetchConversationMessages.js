const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'conversationSid', purpose: 'SID of Convo to get messages' }];

const MAX_MESSAGES_TO_FETCH = 100;

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { conversationSid } = event;
  try {
    const result = [];
    const messages = await twilioExecute(context, (client) => {
      return client.conversations.v1.conversations(conversationSid).messages.list({ limit: MAX_MESSAGES_TO_FETCH });
    });

    // create a result object with the information we want to supply
    for await (const message of messages.data) {
      const media = JSON.stringify(message.media);

      const msg = JSON.parse(`{
            "index": "${message.index}",
            "author": "${message.author}", 
            "body": "${message.body}",
            "media": ${media},
            "dateCreated": "${message.dateCreated}"
            }`);
      result.push(msg);
    }
    response.setBody({ ...result });
    response.setStatusCode(200);
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
