const tr = require('./lib/EMAIL/translations');
console.log(tr('en', 'passwordResetSubject', {domain: 'domain.com'}))
console.log(tr('ru', 'passwordResetSubject', {domain: 'domain.com'}))
console.log(tr('en', 'passwordResetContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
console.log(tr('ru', 'passwordResetContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
console.log(tr('en', 'emailConfirmationSubject', {domain: 'domain.com'}))
console.log(tr('ru', 'emailConfirmationSubject', {domain: 'domain.com'}))
console.log(tr('en', 'emailConfirmationContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
console.log(tr('ru', 'emailConfirmationContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))