'use strict';
console.log('Loading function...');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

var cognitoidentity = new AWS.CognitoIdentity({
	"accessKeyId" : "AKIAI3AZINYLLVNTOB6A",
	"secretAccessKey" : "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",
	"region" : "us-east-1"
});

var p_result = {
	"err" : "0",
	"message" : "",
	"p_data" : {}
};

function getCredentials(identity, fn) {
	var params = {
		IdentityId : identity.id,
		Logins : {			
			"cognito-identity.amazonaws.com" : identity.token
		}
	};
	console.log("token del proveedor cognito "+identity.token);
	cognitoidentity.getCredentialsForIdentity(params, function(err, data) {
		if (err) {
			return fn(err)
		} else {
			fn(null, data)
		}
	});
}

module.exports.handler = function(event, context, cb) {
	context.callbackWaitsForEmptyEventLoop = false;

	var identity = {
			id : event.identity,
			token : event.token
	};
	getCredentials(identity, function(err, data) {
		if (err) {
			p_result.err = "1";
			p_result.message = err;
			return cb(null, p_result);
		} else {
			p_result.p_data = data;
			return cb(null, p_result);

		}
	});
};
