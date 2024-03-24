require('dotenv').config()
// const autoBind = require('auto-bind');
const ut = require(process.cwd() + '/utilities');
const EMAIL_TESTING = require(process.cwd() + '/config').EMAIL_TESTING;

const sgMail = require('@sendgrid/mail');
 sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// console.log(sgMail);
 

const tr = require('./translations')

const strip_tags = (text) => typeof text === 'string' ? text.replace(/<[^>]*>?/gm, '') : '';

  const send = async (email, from = process.env.ADMIN_EMAIL, subject = '', html = '') => {
    const msg = {
      to: email,
      from,
      subject,
      text: strip_tags(html),
      html,
    };
    if (EMAIL_TESTING) {
      console.log(msg);
    }
    else { 
      const sent = await ut.callAPI(sgMail, 'sgMail.send', msg);
      return sent;
    }
    return msg;
  }

  const passwordReset = async (username, email, locale, secret, endpoint = `https://{{domain}}/{{locale}}/reset_password/{{secret}}`) => {

    
    const replace = { domain: process.env.DOMAIN, locale, secret };
    let link;
    for (let id in replace) { 
        link = endpoint.replaceAll(`{{${id}}}`, replace[id]);
    }
   
    const subject = tr(locale, 'passwordResetSubject', { domain: process.env.DOMAIN })
    const content = tr(locale, 'passwordResetContent', {username, link, domain: process.env.DOMAIN})
    const res = await send(email, process.env.ADMIN_EMAIL, subject, content);
    return res;
  }

  const emailConfirmation = async(username, email, locale, secret, endpoint = `https://{{domain}}/{{locale}}/email_confirmation/{{secret}}`) => {

    //console.log(username, email, locale, secret)

   let link;
    const replace = { domain: process.env.DOMAIN, locale, secret };
    for (let id in replace) { 
        link = endpoint.replaceAll(`{{${id}}}`, replace[id]);
    }
    const subject = tr(locale, 'emailConfirmationSubject', {domain: process.env.DOMAIN})
    const content = tr(locale, 'emailConfirmationContent', {username, link, domain: process.env.DOMAIN})
    const res = await send(email, process.env.ADMIN_EMAIL, subject, content);
    return res;
  }

  const check = async() => {      
    await send(process.env.TEST_USER_EMAIL, process.env.ADMIN_EMAIL, `${process.env.DOMAIN} test 2`, `<strong>Here is the <i>${process.env.DOMAIN}</i></strong>`);
  }



module.exports = {send, passwordReset, emailConfirmation, check};
