const request = require('request');
 
const parseSnsRecord = snsRecord => ({
  MessageId: snsRecord.MessageId,
  TopicArn: snsRecord.TopicArn,
  Subject: snsRecord.Subject,
  Message: snsRecord.Message ? JSON.parse(snsRecord.Message) : null,
});
 
const sendToMicrosoftTeams = (eventRecordsStrings, callback) => {
  const httpRequestConfig = {
    uri: process.env.TEAMS_WEBHOOK_URL,
    method: 'POST',
    json: {
      text: eventRecordsStrings.toString(),
    },
  };
  console.log('[INFO] Posting to Webhook...');
  request(httpRequestConfig, (error, response) => {
    const statusCode = (response && response.statusCode) ? response.statusCode : null;
    const logLevel = (statusCode === 200) ? 'INFO' : 'ERROR';
    const logMessage = `[${logLevel}] Posting to Webhook...done. HTTP status code: [${statusCode}]`;
    console.log(logMessage, error || '');
    callback(error, 'done');
  });
};
 
exports.handler = (event, context, callback) => {
  console.log('[INFO] Handler invoked. Event details:', event);
 
  const eventRecords = (event.Records ? event.Records : []);
  console.log('[INFO] Event records: ', eventRecords);
 
  if (eventRecords.length === 0) {
    const errorMessage = 'Ignoring event because it does not contain any records';
    console.log(`[ERROR] ${errorMessage}`);
    callback(errorMessage);
    return;
  }
 
  sendToMicrosoftTeams(eventRecords, callback);
};