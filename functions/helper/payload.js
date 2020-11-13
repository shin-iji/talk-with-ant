const actionType = {
  //RESERVE_PAYMENT: "RESERVE_PAYMENT",
  CHECK_ATTEND: "CHECK_ATTEND",
  SEND_CHECK_ATTEND: "SEND_CHECK_ATTEND",
  COUNT_ATTEND: "COUNT_ATTEND",
  CONFIRM_PAYMENT: "CONFIRM_PAYMENT",
  MULTICAST_COURSE: "MULTICAST_COURSE",
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
  checkReadyPayment: (courseName, orderId, amount) => {
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
                    data: `action=${actionType.CONFIRM_PAYMENT}&courseName=${courseName}&orderId=${orderId}&amount=${amount}`,
                    displayText: "ชำระเงิน",
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
  askTodoAnything: () => {
    return {
      type: "text",
      text: "ต้องการทำอะไรต่อบอกได้นะ",
      quickReply: {
        items: [
          {
            type: "action",
            //imageUrl: "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-1-512.png",
            action: {
              type: "message",
              label: "รายการอบรม",
              text: "รายการอบรม",
            },
          },
          {
            type: "action",
            //imageUrl: "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-1-512.png",
            action: {
              type: "message",
              label: "รายการที่ต้องจ่าย",
              text: "รายการที่ต้องจ่าย",
            },
          },
        ],
      },
    };
  },
  checkAttend: (courseId, courseName) => {
    return {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        size: "kilo",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Tab! to Check Attend",
              color: "#ffffff",
              weight: "bold",
              align: "center",
            },
          ],
          backgroundColor: "#FF783E",
        },
        hero: {
          type: "image",
          url:
            "https://firebasestorage.googleapis.com/v0/b/test-68de0.appspot.com/o/Attend%20Icon.png?alt=media&token=5b537d46-e26c-4941-8033-9b8a98a079bf",
          aspectMode: "cover",
          size: "full",
          action: {
            type: "postback",
            label: "action",
            data: `action=${actionType.CHECK_ATTEND}&courseId=${courseId}`,
            displayText: "เช็คชื่อ",
          },
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${courseName}`,
              color: "#aaaaaa",
            },
          ],
        },
      },
    };
  },
  askedSendCheckAttend: (courseName, date) => {
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
              text: "ต้องการเช็คชื่อเลยไหมอะ",
              color: "#ffffff",
              weight: "bold",
              align: "center",
            },
          ],
          backgroundColor: "#FF783E",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${courseName}`,
              maxLines: 2,
              wrap: true,
              color: "#aaaaaa",
            },
            {
              type: "text",
              text: `${date}`,
              maxLines: 2,
              wrap: true,
              color: "#aaaaaa",
              margin: "md",
            },
            {
              type: "separator",
              margin: "md",
              color: "#ffffff",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "message",
                    label: "ต้องการ",
                    text: "ต้องการ",
                  },
                  position: "relative",
                  height: "md",
                  style: "primary",
                  color: "#FF783E",
                  offsetTop: "80px",
                },
              ],
              width: "125px",
              position: "absolute",
              offsetStart: "155px",
              paddingTop: "12px",
              height: "160px",
            },
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
                  offsetTop: "80px",
                },
              ],
              position: "absolute",
              width: "125px",
              paddingTop: "12px",
              offsetStart: "21px",
              height: "160px",
            },
          ],
          height: "170px",
        },
      },
    };
  },
  sendCheckAttend: (courseId, courseName) => {
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
              text: "CHECK ATTENDED",
              weight: "bold",
              color: "#FF783E",
              size: "sm",
            },
            {
              type: "text",
              text: `${courseName}`,
              weight: "bold",
              size: "xxl",
              margin: "md",
            },
            {
              type: "separator",
              margin: "xxl",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [],
            },
            {
              type: "box",
              layout: "horizontal",
              margin: "md",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: `เริ่มเช็คผู้เข้าร่วม`,
                    displayText: `เช็คชื่อ ${courseName}`,
                    data: `action=${actionType.SEND_CHECK_ATTEND}&courseId=${courseId}&courseName=${courseName}`,
                  },
                  style: "primary",
                  color: "#FF783E",
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
  countAttend: (courseId, courseName) => {
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
              text: "Check Attendees",
              color: "#ffffff",
              weight: "bold",
              align: "center",
            },
          ],
          backgroundColor: "#FF783E",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${courseName}`,
              maxLines: 2,
              wrap: true,
              color: "#aaaaaa",
              align: "center",
            },
            {
              type: "separator",
              margin: "md",
              color: "#ffffff",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "นับยอดผู้เข้าร่วม",
                    data: `action=${actionType.COUNT_ATTEND}&courseId=${courseId}`,
                    displayText: "นับยอดผู้เข้าร่วม",
                  },
                  style: "primary",
                  color: "#FF783E",
                  margin: "none",
                },
              ],
            },
          ],
        },
      },
    };
  },
  listCourses: (courseName, date) => {
    return {
      type: "bubble",
      size: "kilo",
      hero: {
        type: "image",
        url: `https://storage.googleapis.com/antv2-xdbgna.appspot.com/${courseName
          .split(" ")
          .join("_")}`,
        size: "full",
        aspectMode: "fit",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: `${courseName}: `,
                size: "sm",
              },
              {
                type: "text",
                text: `${date}`,
                align: "end",
                size: "sm",
              },
            ],
          },
          {
            type: "separator",
            margin: "md",
            color: "#878787",
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "button",
                action: {
                  type: "message",
                  label: "สมัคร",
                  text: `สมัคร ${courseName}`,
                },
                style: "primary",
                color: "#FF783E",
              },
              {
                type: "button",
                action: {
                  type: "message",
                  label: "ดูข้อมูล",
                  text: `รายละเอียด ${courseName}`,
                },
                style: "secondary",
                offsetStart: "none",
                margin: "5px",
              },
            ],
            margin: "lg",
          },
        ],
      },
      styles: {
        footer: {
          separator: false,
        },
      },
    };
  },
  courseInfo: (courseName, desc, max, available, date, amount) => {
    return {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        size: "kilo",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${courseName}`,
              color: "#ffffff",
              weight: "bold",
              align: "center",
            },
          ],
          backgroundColor: "#FF783E",
        },
        hero: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "image",
              url: `https://storage.googleapis.com/antv2-xdbgna.appspot.com/${courseName
                .split(" ")
                .join("_")}`,
              aspectMode: "fit",
              size: "full",
              aspectRatio: "20:13",
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Information Detail",
                  weight: "bold",
                  color: "#FF783E",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: `${desc}`,
                      offsetStart: "20px",
                    },
                  ],
                },
              ],
            },
            {
              type: "separator",
              margin: "xl",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Max Participant",
                  weight: "bold",
                  color: "#FF783E",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: `${max} Participant`,
                      offsetStart: "20px",
                    },
                  ],
                },
              ],
              offsetTop: "10px",
            },
            {
              type: "separator",
              margin: "xl",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Available Participant",
                  weight: "bold",
                  color: "#FF783E",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: `${available} Participant`,
                      offsetStart: "20px",
                    },
                  ],
                },
              ],
              offsetTop: "10px",
            },
            {
              type: "separator",
              margin: "xl",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Date",
                  weight: "bold",
                  color: "#FF783E",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: `${date}`,
                      offsetStart: "20px",
                    },
                  ],
                },
              ],
              offsetTop: "10px",
            },
            {
              type: "separator",
              margin: "xl",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Price",
                  weight: "bold",
                  color: "#FF783E",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: `${amount} (฿)`,
                      offsetStart: "20px",
                    },
                  ],
                },
              ],
              offsetTop: "10px",
            },
            {
              type: "separator",
              margin: "xl",
              color: "#ffffff",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "Register",
                text: `สมัคร ${courseName}`,
              },
              style: "primary",
              color: "#FF783E",
            },
          ],
        },
      },
    };
  },
  sendUserInfo: (name, email, tel, courseName) => {
    return {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        size: "giga",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Alert",
              color: "#ffffff",
              weight: "bold",
            },
          ],
          backgroundColor: "#FF783E",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Attendee Registered",
              weight: "bold",
              color: "#FF783E",
            },
            {
              type: "separator",
              color: "#ffffff",
              margin: "md",
            },
            {
              type: "text",
              text: "Training with ant",
              color: "#aaaaaa",
              size: "sm",
            },
            {
              type: "separator",
              margin: "md",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "Name",
                  size: "sm",
                },
                {
                  type: "text",
                  text: `${name}`,
                  align: "end",
                  size: "sm",
                },
              ],
              margin: "md",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "Email",
                  align: "start",
                  size: "sm",
                },
                {
                  type: "text",
                  text: `${email}`,
                  align: "end",
                  wrap: true,
                  size: "sm",
                },
              ],
              margin: "md",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "Phone",
                  size: "sm",
                },
                {
                  type: "text",
                  text: `${tel}`,
                  align: "end",
                  size: "sm",
                },
              ],
              margin: "md",
            },
            {
              type: "separator",
              margin: "md",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${courseName}`,
                  color: "#aaaaaa",
                  size: "sm",
                },
              ],
              margin: "md",
            },
          ],
        },
      },
    };
  },
  listPayment: (courseName, amount, paymentUrl) => {
    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "PAYMENT",
            weight: "bold",
            color: "#FF783E",
            size: "sm",
          },
          {
            type: "text",
            text: `${courseName}`,
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
                    text: "cost",
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
              uri: `${paymentUrl}`,
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
    };
  },
  userInfo: (name, tel, email) => {
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
              text: "Talkwithant",
              weight: "bold",
              color: "#FF783E",
              size: "sm",
            },
            {
              type: "text",
              text: "ข้อมูลส่วนตัว",
              weight: "bold",
              size: "xxl",
              margin: "md",
            },
            {
              type: "text",
              text: "จากการสมัครกับเราครั้งก่อน",
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
                      text: "ชื่อ",
                      size: "sm",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: `${name}`,
                      size: "sm",
                      color: "#111111",
                      align: "end",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "เบอร์ติดต่อ",
                      size: "sm",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: `${tel}`,
                      size: "sm",
                      color: "#111111",
                      align: "end",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "อีเมล",
                      size: "sm",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: `${email}`,
                      size: "sm",
                      color: "#111111",
                      align: "end",
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
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "ท่านต้องการใช้ข้อมูลนี้ในการสมัครหรือไม่ ?",
                  wrap: true,
                  margin: "lg",
                  size: "sm",
                  align: "center",
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              margin: "md",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "message",
                    label: "ต้องการ",
                    text: "ต้องการ",
                  },
                  style: "primary",
                  color: "#FF783E",
                },
                {
                  type: "button",
                  action: {
                    type: "message",
                    label: "ไม่ต้องการ",
                    text: "ไม่ต้องการ",
                  },
                  style: "secondary",
                  margin: "5px",
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
  registerFormButton: (courseName, courseId) => {
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
              text: "REGISTER",
              weight: "bold",
              color: "#FF783E",
              size: "sm",
            },
            {
              type: "text",
              text: `${courseName}`,
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
                    label: "สมัคร",
                    uri: `https://liff.line.me/1654378227-QwAzgAb0/enrollcourse?courseId=${courseId}`,
                  },
                  style: "primary",
                  color: "#FF783E",
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
  askMulticastCourse: (courseId) => {
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
              text: "ต้องการประกาศให้ผู้ใช้ไหม",
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
                    data: `action=${actionType.MULTICAST_COURSE}&courseId=${courseId}`,
                    displayText: "กระจายข้อมูล",
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
  createCourseFormButton: () => {
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
              text: "CREATE COURSE",
              weight: "bold",
              color: "#FF783E",
              size: "sm",
            },
            {
              type: "text",
              text: "สร้างงานอบรม",
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
              type: "text",
              size: "md",
              wrap: true,
              margin: "md",
              text: "การสร้าง งานอบรม จะใช้ข้อมูลดังนี้",
            },
            {
              type: "text",
              size: "xs",
              wrap: true,
              margin: "sm",
              text: "ชื่องานอบรม",
            },
            {
              type: "text",
              size: "xs",
              wrap: true,
              margin: "none",
              text: "วันที่จัด",
            },
            {
              type: "text",
              size: "xs",
              wrap: true,
              margin: "none",
              text: "จำนวนคนที่รับ",
            },
            {
              type: "text",
              size: "xs",
              wrap: true,
              margin: "none",
              text: "คำอธิบาย",
            },
            {
              type: "text",
              size: "xs",
              wrap: true,
              margin: "none",
              text: "สถานที",
            },
            {
              type: "text",
              size: "xs",
              wrap: true,
              margin: "none",
              text: "ค่าสมัคร",
            },
            {
              type: "separator",
              margin: "md",
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
                    label: "เริ่มสร้าง",
                    uri: "https://liff.line.me/1654987039-3lvl9O4p",
                  },
                  style: "primary",
                  color: "#FF783E",
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
  feedbackFormButton: (courseName, url) => {
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
              text: "FEEDBACK",
              weight: "bold",
              color: "#FF783E",
              size: "sm",
            },
            {
              type: "text",
              text: `${courseName}`,
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
                    label: "เริ่มทำเเบบสอบถาม",
                    uri: `${url}`,
                  },
                  style: "primary",
                  color: "#FF783E",
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
  askedMulticastFeedback: (courseName) => {
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
              text: "ต้องการส่งแบบสอบถามเลยมั้ย",
              color: "#ffffff",
              weight: "bold",
              align: "center",
            },
          ],
          backgroundColor: "#FF783E",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${courseName}`,
              color: "#aaaaaa",
              align: "center",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "message",
                    label: "ต้องการ",
                    text: `ส่งแบบสอบถาม ${courseName}`,
                  },
                  position: "relative",
                  height: "md",
                  style: "primary",
                  color: "#FF783E",
                  offsetTop: "60px",
                },
              ],
              width: "125px",
              position: "absolute",
              offsetStart: "155px",
              height: "160px",
            },
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
                  offsetTop: "60px",
                },
              ],
              position: "absolute",
              width: "125px",
              offsetStart: "21px",
              height: "160px",
            },
          ],
          height: "130px",
        },
      },
    };
  },
  listCheckAttend: (courseId, courseName) => {
    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "CHECK ATTENDED",
            weight: "bold",
            color: "#FF783E",
            size: "sm",
          },
          {
            type: "text",
            text: `${courseName}`,
            weight: "bold",
            size: "xxl",
            margin: "md",
          },
          {
            type: "separator",
            margin: "xxl",
          },
          {
            type: "box",
            layout: "vertical",
            contents: [],
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: `เริ่มเช็คผู้เข้าร่วม`,
                  displayText: `เช็คชื่อ ${courseName}`,
                  data: `action=${actionType.SEND_CHECK_ATTEND}&courseId=${courseId}&courseName=${courseName}`,
                },
                style: "primary",
                color: "#FF783E",
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
    };
  },
  askTodoAnythingOwner: () => {
    return {
      text: "ต้องการทำอะไรต่อบอกได้นะ",
      type: "text",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              text: "สร้างคอร์ส",
              type: "message",
              label: "สร้างคอร์ส",
            },
          },
          {
            action: {
              label: "เช็คชื่อ",
              type: "message",
              text: "เช็คชื่อ",
            },
            type: "action",
          },
          {
            type: "action",
            action: {
              label: "ส่งแบบสอบถาม",
              text: "ส่งแบบสอบถาม",
              type: "message",
            },
          },
        ],
      },
    };
  },
};
