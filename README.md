# Talk with Ant (คุยกับมด)

Talk with Ant is a chatbot that will assist in the registration of various training events through chatting and using templates in the Line application. A chatbot will help the participants and organizers to reduce the use of people in various management.


## Prerequisites

* Understand Cloud Function [(Tutorial)](https://firebase.google.com/docs/functions)
* Firebase CLI. [(Installation)](https://firebase.google.com/docs/cli)
* NodeJS


## Installing

```
git clone [Git URL]
```
```
cd talk-with-ant
```
```
cd functions
```
```
npm install
```

## Development
1. Start the cloud function server.
```
cd functions
```
```
npm run serve
```
2. Open the local port to the local machine for webhook.
* Windows
```
ngrok http 5001
```
* MacOS
```
./ngrok http 5001
```
3.Edit the dialogflow fulfillment and line developer webhook for Dev agent to ngrok path
```
https://xxxxxx.ngrok.io/{project Id}/{region}/{function name}
```

## Deployment

```
cd functions
```
```
npm run deploy
```


## Authors

* **Witsarut** - *Front-End & Chatbot Developer* - [FB](https://www.facebook.com/shindanai.b/)
* **Siradanai** - *Back-End Developer* - [FB](https://www.facebook.com/Laviathan)
* **Surat** - *Front-End Developer* - [FB](https://www.facebook.com/Zeron.Surat)

See also the list of [contributors](https://github.com/shin-iji/talk-with-ant/graphs/contributors) who participated in this project.

