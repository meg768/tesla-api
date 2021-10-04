var isFunction = require('yow/isFunction');
var isDate = require('yow/isDate');
var isString = require('yow/isString');
var Request = require('yow/request');
var Events = require('events');
var {VehicleData} = require('./vehicle-data.js');

module.exports = class TeslaAPI extends Events {

    constructor(options) {

        options = options || {};

        super();

        var {vin = process.env.TESLA_VIN, username = process.env.TESLA_USER, password = process.env.TESLA_PASSWORD, clientID = process.env.TESLA_CLIENT_ID, clientSecret = process.env.TESLA_CLIENT_SECRET} = options;

        if (clientID == undefined || (isString(clientID) && clientID.length == 0))
            clientID = '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384';
        
        if (clientSecret == undefined || (isString(clientSecret) && clientSecret.length == 0))
            clientSecret = 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3';

        if (!username)
            throw new Error('Need Tesla credentials. A username must be specified');

        if (!password)
            throw new Error('Need Tesla credentials. A password must be specified');

        if (!clientID)
            throw new Error('Need Tesla credentials. A clientID must be specified');
        
        if (!clientSecret)
            throw new Error('Need Tesla credentials. A clientSecret must be specified');

        if (!vin) 
            throw new Error('Need the VIN number of your Tesla.');

        this.api            = null;
        this.vehicle        = null;
        this.vin            = vin;
        this.username       = username;
        this.password       = password;
        this.clientID       = clientID;
        this.clientSecret   = clientSecret;
        this.requests       = {};
        this.lastResponse   = null;
        this.wakeupInterval = 7 * 60000;
        this.wakeupTimeout  = 2 * 60000;


        this.log          = isFunction(options.log) ? options.log : (options.log ? console.log : () => {});
        this.debug        = isFunction(options.debug) ? options.debug : (options.debug ? console.debug : () => {});

		console.log('CONSTRUCT');
    }


    async login() {
        if (this.vehicle)
            return this.vehicle;

        var defaultOptions = {
            debug: true,
            timeout: 2 * 60000,
            headers: {
                "x-tesla-user-agent": "TeslaApp/3.4.4-350/fad4a582e/android/8.1.0",
                "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; Pixel XL Build/OPM4.171019.021.D1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36",
                "content-type": "application/json; charset=utf-8"
            }
        };

        var api = new Request('https://owner-api.teslamotors.com', defaultOptions);
        var vehicle = null;
        var token = null;

		var options = {
			body: {
				"grant_type": "password",
				"client_id": this.clientID,
				"client_secret": this.clientSecret,
				"email": this.username,
				"password": this.password      
			}
		}

		return api.request('POST', '/oauth/token', options);

	}


}
/*

12345678901234567890123456789012345678901234567890123456789012345678901234567890111111
6a6f718d0a45c47dcd06ae155b355898f305f7704d0d858413414680c08babf7
NmE2ZjcxOGQwYTQ1YzQ3ZGNkMDZhZTE1NWIzNTU4OThmMzA1Zjc3MDRkMGQ4NTg0MTM0MTQ2ODBjMDhiYWJmNw==

*/