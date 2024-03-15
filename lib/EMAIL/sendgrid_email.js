require('dotenv').config()
const autoBind = require('auto-bind');
const sgMail = require('@sendgrid/mail');

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

    const subject = {
      en:'Change password for domain.com',
      ru:'Смена пароля для domain.com'
    }

    const link = `https://${process.env.DOMAIN}/${locale}/reset_password/${secret}`

    const content = {
      en:`<p>Hello, ${username}</p><p>You can change your password <a href="${link}">here</a>.</p><p>Regards</p><p>${process.env.DOMAIN}</p>`,
      ru:`<p>Здравствуйте, ${username}</p><p>Вы можете поменять ваш пароль <a href="${link}">здесь</a>.</p><p>Всего хорошего</p><p>${process.env.DOMAIN}</p>`
    }
    const res = await this.send(email, process.env.ADMIN_EMAIL, subject[locale], content[locale]);
    return res;
  }

  async emailConfirmation(username, email, locale, secret){

    //console.log(username, email, locale, secret)

    const subject = {
      en:'E-mail confirmation for domain.com',
      ru:'Подтверждение e-mail для domain.com'
    }

    const link = `https://domain.com/${locale}/email_confirmation/${secret}`

    const content = {
      en:`<p>Hello, ${username}</p><p>You can confirm your e-mail <a href="${link}">here</a>.</p><p>Regards</p><p>${process.env.DOMAIN}/p>`,
      ru:`<p>Здравствуйте, ${username}</p><p>Вы можете подтвердить ваш e-mail <a href="${link}">здесь</a>.</p><p>Всего хорошего</p><p>${process.env.DOMAIN}</p>`
    }
    const res = await this.send(email, process.env.ADMIN_EMAIL, subject[locale], content[locale]);
    return res;
  }

  check(){      
    this.send(process.env.TEST_USER_EMAIL, process.env.ADMIN_EMAIL, `${process.env.DOMAIN} test 2`, `<strong>Here is the <i>${process.env.DOMAIN}</i></strong>`);
  }

}

module.exports = new SendgridEmail();