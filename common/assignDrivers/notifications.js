const admin = require('firebase-admin');
const serviceAccount = require('../../fcm.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, message) => {
  const payload = {
    notification: {
      title: message.title,
      body: message.body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(payload);
    console.log('Successfully sent notification:', response);
  } catch (error) {
    console.log('Error sending notification:', error);
  }
};

module.exports = {
    sendNotification,
}