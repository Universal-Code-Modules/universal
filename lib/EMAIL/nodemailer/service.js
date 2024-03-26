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

  async sendOneMail(msg) {
    let transporter = nodemailer.createTransport(this.#cfg);
    return await transporter.sendMail(msg,
      (err, info) => { 
        if (err) {
          console.log("Error sending message", err);
          return process.exit(1);
        }
        console.log('Message sent successfully!');
        //console.log(nodemailer.getTestMessageUrl(info));
        transporter.close();
    });
  }
}

module.exports = NodemailerEmail;
