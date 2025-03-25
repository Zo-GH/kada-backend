const axios = require('axios')
const { config } = require('../config/config')

const AKESEL_API_KEY = config.AKESEL_API_KEY

function validatePhoneNumber(phoneNumber) {
    return /^(?:\+233|233|0)\d{9}$/.test(phoneNumber);
}

function formatForAkesel(phone) {
    return phone.replace(/^(\+?233|0)/, '233');
}

async function sendSMS(recipient, message, senderId = "ZO-GH") {
    const formattedNumber = formatForAkesel(recipient);

    if (!validatePhoneNumber(recipient)) {
        throw new Error("Invalid phone number format.")
    }

    try {

        const url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${AKESEL_API_KEY}&to=${formattedNumber}&from=${senderId}&sms=${encodeURIComponent(message)}`; 

        const response = await axios.get(url);
        return response.data;
    } catch(error) {
        console.error("Error sending SMS:", error.response ? error.response.data : error.message)
        throw error
    }
}

module.exports = sendSMS;