const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");
const { Payload } = require("dialogflow-fulfillment");

module.exports = (agent) => {
  // const payloadJson = lineHelper.createFlexMessage(
  //   "test",
  //   linePayload.listPayment("test", 100, "test")
  // );
  const payloadJson = {
    type: "flex",
    altText: "test",
    contents: {
      type: "carousel",
      contents: [
        {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "FEEDBACK",
                size: "sm",
                color: "#FF783E",
                weight: "bold",
              },
            ],
            offsetTop: "none",
            offsetBottom: "none",
            offsetStart: "none",
            offsetEnd: "none",
            paddingBottom: "none",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "courseName",
                weight: "bold",
                size: "xxl",
                margin: "md",
              },
              {
                type: "text",
                text: "Training with ant",
                size: "xs",
                color: "#aaaaaa",
                wrap: true,
              },
              {
                type: "separator",
                margin: "xxl",
              },
              {
                type: "box",
                layout: "vertical",
                margin: "xxl",
                spacing: "sm",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "เริ่มส่งเเบบสอบถาม",
                      uri: "http://RegisterLink.com/",
                    },
                    style: "primary",
                    color: "#FF783E",
                  },
                ],
              },
            ],
            offsetTop: "none",
            paddingTop: "none",
          },
          styles: {
            footer: {
              separator: true,
            },
          },
        },
      ],
    },
  };
  let payload = new Payload(`LINE`, payloadJson, {
    sendAsMessage: true,
  });
  agent.add("test");
  agent.add(payload);
  //const str = agent.session;
  //const list = str.split("/")[4];
  //console.log(list);
};
