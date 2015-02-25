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
	}
};
