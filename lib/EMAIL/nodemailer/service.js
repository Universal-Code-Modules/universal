"use strict"

require("dotenv").config();
const nodemailer = require("nodemailer");
const serverStates = require("./states.js");

class NodemailerEmail {
  #cfg = null;

  constructor(cfg) {
    this.testing = process.env.NODE_ENV === "test";
    this.#cfg = cfg;
  }

  checkServerStatus() {
    let serverStatus = serverStates["NotChecked"];
    let  transporter = nodemailer.createTransport(this.#cfg);
    serverStatus = transporter.verify() ? serverStates["Available"] : serverStates["NotAvailable"];
    transporter.close();
    return serverStatus;
  }

  sendOneMail(msg) {
    let transporter = nodemailer.createTransport(this.#cfg);
    transporter.sendMail(msg,
      (err, info) => { 
        if (err) {
          console.log("Error sending message", err);
          return process.exit(1);
        }
        console.log('Message sent successfully!');
    });
    transporter.close();
  }

  sendListMassages(messages, maxConnections = 5, maxMessages=100) {
    let cfg = {
      ...this.#cfg,
      pool: true,
      maxConnections,
      maxMessages,
    };
    let transporter = nodemailer.createTransport(cfg);
    transporter.on("idle", function () {
      while (transporter.isIdle() && messages.length) {
        transporter.sendMail(messages.shift());
      }
    });
    console.log('List of messages sent successfully!');
    transporter.close();
  }
}

module.exports = NodemailerEmail;
