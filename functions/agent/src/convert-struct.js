const structjson = require("../lib/structjson");

exports.convertStruct = async (intentResponse) => {
  const intentResponseMessage = intentResponse.queryResult.fulfillmentMessages;
  //console.log(intentResponseMessage[0]);
  const replyMessage = intentResponseMessage.map((messageObj) => {
    let struct;
    if (messageObj.message === "text") {
      return {
        type: "text",
        text: messageObj.text.text[0],
      };
    } else if (messageObj.message === "payload") {
      if (messageObj.platform === "LINE") {
        struct = messageObj.payload.fields.line.structValue;
        //console.log(struct);
        return structjson.structProtoToJson(struct);
      } else {
        struct = messageObj.payload;
        //console.log(struct);
        return structjson.structProtoToJson(struct);
      }
    }
    return null;
  });
  return replyMessage;
};
