const dialogflow = require("dialogflow");

exports.detectIntent = async (
  DIALOGFLOW_PROJECTID,
  DIALOGFLOW_SERVICE_ACCOUNT,
  userId,
  message,
  languageCode
) => {
  const sessionClient = new dialogflow.SessionsClient({
    DIALOGFLOW_PROJECTID,
    keyFilename: DIALOGFLOW_SERVICE_ACCOUNT,
  });
  const sessionPath = sessionClient.sessionPath(DIALOGFLOW_PROJECTID, userId);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode,
      },
    },
  };
  const responses = await sessionClient.detectIntent(request);
  return responses[0];
};
