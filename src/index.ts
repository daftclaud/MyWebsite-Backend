import * as functions from 'firebase-functions';
import request = require('request');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = require('twilio')(accountSid, authToken);
const twilioNumber = '+12182824669';
const oxfordKey = functions.config().oxford.key;

/*
    To-do:
        1. Error-handling
*/
type WordType = 'noun' | 'adjective' | 'adverb' | 'verb';
export const getDefinitions = functions.https.onRequest(async (req, response) => {
    const incoming = req.body.Body as String;
    const word = incoming.split(' ')[0];
    const type = incoming.split(' ')[1] as WordType;
    const url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${oxfordKey}`;
    const resText = await new Promise((resolve, reject) => {
        request(url, {json: true}, (err, res, body) => {
            resolve(getTextResponse({ body, type }));
        })
    });
    const textMessage = {
        body: resText,
        to: req.body.From,
        from: twilioNumber
    }

    return client.messages.create(textMessage)
});

const getTextResponse = ({ body, type }: { body: Array<OxfordResponse>; type: WordType; }) => {
    const defs = body.filter(el => el.fl === type).map(el => el.shortdef)[0];
    let text = 'Which definition would you like to add? \n\n';
    defs.forEach((def, index) => {
        text += `${index + 1}) ${def} \n`
    });
    return text;
}
