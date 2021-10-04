require('dotenv').config();

/*

var crypto = require('crypto');

function generateCodeVerifier() {
    // Tesla might use something more sophisticated, but in my experience it's a 112-char alphanumeric string so let's just do that
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var random = crypto.randomBytes(86);
    var output = '';
    for (var i = 0; i < random.length; i++) {
        output += chars[random[i] % chars.length];
    }
    return output;
}

function generateCodeChallenge(verifier) {
    var hash = crypto.createHash('sha256');
    hash.update(verifier);
    return hash.digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

var codeVerifier = generateCodeVerifier();
var codeChallenge = generateCodeChallenge(codeVerifier);

var queryString = {
	//        audience: '',
			client_id: 'ownerapi',
			code_challenge: codeChallenge,
			code_challenge_method: 'S256',
			locale: 'en',
			prompt: 'login',
			redirect_uri: 'https://auth.tesla.com/void/callback',
			response_type: 'code',
			scope: 'openid email offline_access',
			state: generateCodeChallenge(generateCodeVerifier())
		};

		console.log(queryString);

		*/

		var tjs = require('teslajs');

    var username = process.env.TESLA_USER;
    var password = process.env.TESLA_PASSWORD;
    var mfaPassCode = undefined;

	console.log(username, password);
    tjs.login({
        username: username,
        password: password,
        mfaPassCode: mfaPassCode
    }, function(err, result) {
		console.log(err);
        if (result.error) {
          console.log(JSON.stringify(result.error));
          process.exit(1);
        }

        var token = JSON.stringify(result.authToken);

        if (token)
            console.log("Login Succesful!");
    });