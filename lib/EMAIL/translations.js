
const Translations = () => {
    
     const translations = {
                en: {
                    passwordResetSubject:'Change password for {{domain}}',
                    passwordResetContent:`<p>Hello, {{username}}</p><p>You can change your password <a href="{{link}}">here</a>.</p><p>Regards</p><p>{{domain}}</p>`,
                    emailConfirmationSubject:'E-mail confirmation for {{domain}}',
                    emailConfirmationContent:`<p>Hello, {{username}}</p><p>You can confirm your e-mail <a href="{{link}}">here</a>.</p><p>Regards</p><p>{{domain}}</p>`

                },
                ru: {
                    passwordResetSubject:'Смена пароля для {{domain}}',
                    passwordResetContent:`<p>Здравствуйте, {{username}}</p><p>Вы можете поменять ваш пароль <a href="{{link}}">здесь</a>.</p><p>Всего хорошего</p><p>{{domain}}</p>`,
                    emailConfirmationSubject:'Подтверждение e-mail для {{domain}}',
                    emailConfirmationContent:`<p>Здравствуйте, {{username}}</p><p>Вы можете подтвердить ваш e-mail <a href="{{link}}">здесь</a>.</p><p>Всего хорошего</p><p>{{domain}}</p>`
                    
                }
     }
    
    
   return (locale, key, inserts = {}) => {
        if (!translations[locale] || !translations[locale][key]) throw new Error(`No translation for ${locale} and ${key}`);
        let string = translations[locale][key];
        for (let key in inserts){
            string = string.replaceAll(`{{${key}}}`, inserts[key]);
        }

        return string;
    }
}
module.exports = Translations();


