"use strict";
require("dotenv").config();
const Nodemailer = require("../../../lib/EMAIL/nodemailer/service.js");
const states = require("../../../lib/EMAIL/nodemailer/states.js");
const pars = require("./params.js");

const nodemailer = new Nodemailer(
  pars.mailConfig[process.env.MAIL_SERVICE_NAME]
);
const status = nodemailer.checkServerStatus();
if (status === states["Available"]) {
  const message = {
    from: "test@example.com",
    to: process.env.TEST_USER_EMAIL,
    subject: "Test message",
    text: "Test message",
    html: "",
  };
  const messagesList = [
    {
      from: "test@example.com",
      to: process.env.TEST_USER_EMAIL,
      subject: "#1 Test message from list",
      text: "Test message",
      html: "",
    },
    {
      from: "test@example.com",
      to: process.env.TEST_USER_EMAIL,
      subject: "#2 Test message from list",
      text: "Test message",
      html: "",
    },
    {
      from: "test@example.com",
      to: process.env.TEST_USER_EMAIL,
      subject: "#3 Test message from list",
      text: "Test message",
      html: "",
    },
  ];

  nodemailer.sendOneMail(message);
  nodemailer.sendOneMail(message);
  nodemailer.sendOneMail(message);
//  nodemailer.sendListMassages(messagesList);
}
