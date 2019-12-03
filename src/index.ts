import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import request = require('request');
admin.initializeApp(functions.config().firebase);
const fs = admin.firestore();
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = require('twilio')(accountSid, authToken);
const twilioNumber = '+12182824669';
const oxfordKey = functions.config().oxford.key;

/*
    To-do:
        1. Error-handling
        2. Implement choose definition
*/
type WordType = 'noun' | 'adjective' | 'adverb' | 'verb';
export const twilioAssistant = functions.https.onRequest(async (req, response) => {
    const incoming = req.body.Body as String;

    if (!isNaN(+incoming)) {
        const choice = +incoming;
        const defsRef = await fs.doc('Functions/Storage').get();
        const defsData = defsRef.data();
        const word = defsData ? defsData.word as string : '';
        const type = defsData ? defsData.type as string : '';
        const defs = defsData ? defsData.definitions as string[] : [];

        if (choice <= 0 || choice > defs.length) {
            return;
        }

        const ref = await getWordFeedRef();
        const definition = defs[choice - 1];
        await ref.update({
            words: admin.firestore.FieldValue.arrayUnion({
                word,
                definition,
                type
            })
        });

        const textMessage = {
            body: `Added choice #${choice} to today's word feed 👍`,
            to: req.body.From,
            from: twilioNumber
        }

        return client.messages.create(textMessage)
    } else {
        const word = incoming.split(' ')[0].toLowerCase();
        const type = incoming.split(' ')[1].toLowerCase() as WordType;
        const url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${oxfordKey}`;
        const resText = await new Promise((resolve, reject) => {
            request(url, { json: true }, async (err, res, body) => {
                const definitions = getDefsArray({ body, type });
                await fs.doc('Functions/Storage').set({
                    word,
                    type,
                    definitions
                });
                resolve(getTextResponse({ body, type }));
            })
        });
        const textMessage = {
            body: resText,
            to: req.body.From,
            from: twilioNumber
        }

        return client.messages.create(textMessage);
    }
});

const getTextResponse = ({ body, type }: { body: Array<OxfordResponse>; type: WordType; }) => {
    const defs = getDefsArray({ body, type });
    let text = 'Which definition would you like to add? \n\n';
    defs.forEach((def, index) => {
        text += `${index + 1}) ${def} \n`
    });
    return text;
}

const getDefsArray = ({ body, type }: { body: Array<OxfordResponse>; type: WordType; }) => {
    return body.filter(el => el.fl === type).map(el => el.shortdef)[0];
}

// Creates one if there isn't one
const getWordFeedRef = async () => {
    const now = Date.now();
    const today = new Date(now - 5*60*60*1000).toDateString();
    const wordFeedQuery = await fs.collection('WordFeeds').where('creationDate', '==', new Date(Date.parse(today)).toISOString().split('T')[0]).get();
    if (wordFeedQuery.empty) {
        return await fs.collection('WordFeeds').add({
            creationDate: new Date(Date.parse(today)).toISOString().split('T')[0],
            words: []
        })
    } else {
        return wordFeedQuery.docs[0].ref;
    }
}
