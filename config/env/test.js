'use strict';

module.exports = {
  db: 'mongodb://localhost/andonation-test',
  port: 3000,
  app: {
    title: 'Andonation'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '533269567434-r3uvhfndb2lenmd48cehv9usupqe6mhe.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'xAPefjMdlMmjWM-gg55xaUam',
    callbackURL: '/auth/google/callback'
  },
  subledger: {
    identity_id: 'PNKWmtgMsLoHzB4LhUw4qN',
    org_id: 'EpXxbhcVpxyC8BH0icuIQF',
    book_id: 'R6WkhSAmw4STDyGHbrrFJL',
    key_id: '2lzQysbyNXhPgYxx8pp2vE',
    secret_id: 'CJzZPwRw01thgquyeD6RYc',
    bank_id: '6HNEAjoyxWtXjVXD2TyZqE',
    system_id: 'E8GtyKhrPjSduG8aHSUusc'
  }
};
