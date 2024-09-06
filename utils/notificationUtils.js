const { sendNotification } = require('../common/notifications');

const notifyPassenger = async (passenger, title, body) => {
    if (passenger && passenger.fcmToken) {
        await sendNotification(passenger.fcmToken, { title, body });
    } else {
        console.log('No valid passenger or token found for notification.');
    }
};

const notifyDriver = async (driver, title, body) => {
    if (driver && driver.fcmToken) {
        await sendNotification(driver.fcmToken, { title, body });
    } else {
        console.log('No valid driver or token found for notification.');
    }
};

module.exports = {
    notifyPassenger,
    notifyDriver,
};
