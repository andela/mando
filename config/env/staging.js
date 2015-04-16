'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/andonation',
  assets: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angularjs-toaster/toaster.css',
        'public/lib/ng-table/dist/ng-table.min.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/moment/moment.js',
        'public/lib/angular-youtube-mb/src/angular-youtube-embed.js',
        'public/lib/angularjs-toaster/toaster.js',
        'public/lib/ng-lodash/build/ng-lodash.min.js',
        'public/lib/subledger-js-library/build/subledger.js',
        'public/lib/jquery/dist/jquery.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/ng-table/dist/ng-table.min.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
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
