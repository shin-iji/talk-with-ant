const actionType = {
  RESERVE_PAYMENT: "RESERVE_PAYMENT",
};

module.exports = {
  startPayment: (courseName, amount, url) => {
    return {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "RECEIPT",
              weight: "bold",
              color: "#FF783E",
              size: "sm",
            },
            {
              type: "text",
              text: "Talk with Ant",
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
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: `${courseName}`,
                      size: "md",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: `${amount} (฿)`,
                      align: "end",
                      size: "md",
                    },
                  ],
                },
              ],
            },
            {
              type: "separator",
              margin: "xxl",
            },
            {
              type: "button",
              action: {
                type: "uri",
                label: "ชำระเงิน",
                uri: `${url}`,
              },
              color: "#FF783E",
              style: "primary",
              offsetTop: "10px",
            },
          ],
        },
        styles: {
          footer: {
            separator: true,
          },
        },
      },
    };
  },
  checkReadyPayment: (courseName, amount) => {
    return {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ต้องการจ่ายเงินเลยไหมอะ",
              align: "center",
              weight: "bold",
              size: "xl",
              color: "#ffffff",
            },
          ],
          backgroundColor: "#FF783E",
        },
        body: {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "message",
                    label: "ไม่ต้องการ",
                    text: "ไม่ต้องการ",
                  },
                  position: "relative",
                  style: "secondary",
                },
              ],
              position: "absolute",
              width: "125px",
              paddingTop: "19px",
              offsetStart: "21px",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "ต้องการ",
                    data: `action=${actionType.RESERVE_PAYMENT}&courseId=${courseName}&amount=${amount}`,
                  },
                  position: "relative",
                  height: "md",
                  style: "primary",
                  color: "#FF783E",
                },
              ],
              width: "125px",
              position: "absolute",
              offsetStart: "155px",
              paddingTop: "19px",
            },
          ],
          height: "90px",
        },
      },
    };
  },
  successPayment: (courseName, amount) => {
    return {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "RECEIPT",
              weight: "bold",
              color: "#FF783E",
              size: "sm",
            },
            {
              type: "text",
              text: "Talk with Ant",
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
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: `${courseName}`,
                      size: "md",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: `${amount} (฿)`,
                      align: "end",
                      size: "md",
                    },
                  ],
                },
              ],
            },
            {
              type: "separator",
              margin: "xxl",
            },
            {
              type: "box",
              layout: "horizontal",
              margin: "md",
              contents: [
                {
                  type: "text",
                  text: "Thank you!",
                  size: "xs",
                  color: "#aaaaaa",
                  flex: 0,
                },
              ],
            },
          ],
        },
        styles: {
          footer: {
            separator: true,
          },
        },
      },
    };
  },
};
