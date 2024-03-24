require('dotenv').config()

module.exports = {
  mailConfig: {
    gmail: {
      auth: {
        user: process.env.MAIL_SERVICE_USER,
        pass: process.env.MAIL_SERVICE_PASSWORD,
      },
    },
    ethereal: {
      host: "smtp.ethereal.email",
      port: 587,
      tls: {
          rejectUnauthorized: true,
          minVersion: "TLSv1.2"
      },
      auth: {
        user: process.env.MAIL_SERVICE_USER,
        pass: process.env.MAIL_SERVICE_PASSWORD,
      },
    }
  },
};