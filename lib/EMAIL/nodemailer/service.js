"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");
const serverStates = require("./states.js");

class NodemailerEmail {

  #serverStatus;

  constructor(cfg) {
    this.testing = process.env.NODE_ENV === "test";
    this.#serverStatus = this.checkServerStatus(cfg.mailConfig);
  }

  get serverStatus() {
    return this.#serverStatus;
  }

  checkServerStatus() {
    this.transporter = nodemailer.createTransport(cfg);
    this.transporter.verify(function (error, success) {
        if (error) {
          this.#serverStatus = serverStates['NotAvailable'];
          (this.testing) ?? console.log("SMTP server isn't ready to take any messages!");
        } else {
          this.#serverStatus = serverStates['Available'];
          (this.testing) ?? console.log("SMTP server is ready to take messages...");
        }
    });
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

module.exports = new NodemailerEmail();
