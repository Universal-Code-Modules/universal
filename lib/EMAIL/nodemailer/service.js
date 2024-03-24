"use strict";
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
    this.transporter = nodemailer.createTransport(this.#cfg);
    serverStatus = this.transporter.verify() ? serverStates["Available"] : serverStates["NotAvailable"];
    return serverStatus;
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail(
      {
        from: process.env.SMTP_GMAIL_USER,
        to,
        subject: "Відновлення доступу до сайту",
        text: "",
        html: `
        `,
      },
      (err) => {
        //console.log(err);
        console.log("Помилка при відправленні повідомлення", err);
      }
    );
  }
}

//module.exports = new NodemailerEmail();
module.exports = NodemailerEmail;
