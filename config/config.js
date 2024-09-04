require("dotenv").config();

class ENVs {
  MONGO_URI = process.env.MONGO_URI;
  ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  PUBLIC_KEY = process.env.PUBLIC_KEY;
  PRIVATE_KEY = process.env.PRIVATE_KEY;
  URL_ENDPOINT = process.env.URL_ENDPOINT;
  BASEURL = process.env.BASEURL;
  OTHER_EMAILS = process.env.OTHER_EMAILS;
  PORT = process.env.PORT
  JWT_SECRET = process.env.JWT_SECRET;
  EMAIL_PASS = process.env.EMAIL_PASS
  EMAIL_USER = process.env.EMAIL_USER
  TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
  TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER
}

const config = new ENVs();

module.exports = {
  config,
};
