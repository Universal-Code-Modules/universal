const { 
  send,
  passwordReset,
  emailConfirmation
} = require('../sendgrid_email');


jest.setTimeout(20000);

describe('Sendgrid Email Connector', () => { 

    test("send", async () => {
        const res = await send(process.env.TEST_USER_EMAIL, process.env.ADMIN_EMAIL, 'Test Email Subject', '<h1>Test Email Content</h1>');
        expect(res).toBeArray();
    });
  
    test("passwordReset", async () => {
        const res = await passwordReset('John', process.env.TEST_USER_EMAIL, 'en', 'secret');
        expect(res).toBeArray();
    });
  
  test("emailConfirmation", async () => {
        const res = await emailConfirmation('John', process.env.TEST_USER_EMAIL, 'en', 'secret');
        expect(res).toBeArray();
    });

})