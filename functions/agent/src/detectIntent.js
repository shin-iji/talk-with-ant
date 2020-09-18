const DIALOGFLOW_PROJECTID = "antv2-xdbgna";
const DIALOGFLOW_SERVICE_ACCOUNT = "dialogflow-service-account.json";

const dialogflow = require("dialogflow");

const sessionClient = new dialogflow.SessionsClient({
  DIALOGFLOW_PROJECTID,
  keyFilename: DIALOGFLOW_SERVICE_ACCOUNT,
});

exports.detectIntent = async (userId, message, languageCode) => {
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
