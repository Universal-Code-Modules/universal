require('dotenv').config()
const autoBind = require('auto-bind');
const sgMail = require('@sendgrid/mail');
const tr = require('./translations')

const strip_tags = (text) => typeof text == 'String' ? text.replace(/<[^>]*>?/gm, '') : '';



class SendgridEmail {

  constructor(){
    autoBind(this);   
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.testing = process.env.NODE_ENV == 'test';
  }

  async send(email, from = process.env.ADMIN_EMAIL, subject = '', html = ''){
    const msg = {
      to: email,
      from,
      subject,
      text: strip_tags(html),
      html,
    };
    if (!this.testing) {
      const sent = sgMail.send(msg);
      console.log(sent);
    }
    return msg;
  }

  async passwordReset(username, email, locale, secret){

    const subject = tr(locale, 'passwordResetSubject', {domain: process.env.DOMAIN})

    const link = `https://${process.env.DOMAIN}/${locale}/reset_password/${secret}`

    const content = tr(locale, 'passwordResetContent', {username, link, domain: process.env.DOMAIN})
    const res = await this.send(email, process.env.ADMIN_EMAIL, subject, content);
    return res;
  }

  async emailConfirmation(username, email, locale, secret){

    //console.log(username, email, locale, secret)

    const subject = tr(locale, 'emailConfirmationSubject', {domain: process.env.DOMAIN})

    const link = `https://domain.com/${locale}/email_confirmation/${secret}`

    const content = tr(locale, 'emailConfirmationContent', {username, link, domain: process.env.DOMAIN})
    const res = await this.send(email, process.env.ADMIN_EMAIL, subject, content);
    return res;
  }

  check(){      
    this.send(process.env.TEST_USER_EMAIL, process.env.ADMIN_EMAIL, `${process.env.DOMAIN} test 2`, `<strong>Here is the <i>${process.env.DOMAIN}</i></strong>`);
  }

}

module.exports = new SendgridEmail();
