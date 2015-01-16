// /config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'twitterAuth' : {
        'consumerKey'       : '',
        'consumerSecret'    : '',
        'accessToken'		: '',
        'accessTokenSecret'	: '',
        'callbackURL'       : 'http://localhost:8282/auth/twitter/callback'
    }

};