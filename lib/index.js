"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = require('twilio')(accountSid, authToken);
const twilioNumber = '+12182824669';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.getDefinitions = functions.https.onRequest((request, response) => {
    const textMessage = {
        body: `hello world`,
        to: request.body.From,
        from: twilioNumber
    };
    return client.messages.create(textMessage);
});
//# sourceMappingURL=index.js.map