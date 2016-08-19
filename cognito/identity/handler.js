'use strict';
console.log('Loading function...');
var AWS = require('aws-sdk');
var dynamoDBConf = {
	"accessKeyId" : "AKIAJDV4BWUE6BTCCNQA",
	"secretAccessKey" : "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",
	"region" : "us-east-1",
};

AWS.config.update(dynamoDBConf);
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

function getUser(email, fn) {

	dynamodb.scan({
		TableName : "prestatario",
		FilterExpression : 'correo = :correo',
		ExpressionAttributeValues : {
			':correo' : email
		}
	}, function(err, data) {
		if (err)
			return fn(err);
		else {
			if ('Items' in data) {
				var registro = data.Items[0];
				fn(null, registro.username);
			} else {
				console.log("Items do not exist");
				fn(null, null); // User not found
			}
		}
	});
}

function getToken(email, fn) {
	var param = {
		IdentityPoolId : "us-east-1:b6a48c94-49bf-4c92-b2be-f4e8a40c4313",
		Logins : {}
	};
	param.Logins["mi-rtd.resuelve.app"] = email;
	cognitoidentity.getOpenIdTokenForDeveloperIdentity(param, function(err,
			data) {
		if (err) {
			return fn(err);
		} else {
			console.log("--------DATA DEL POOL " + data)
			fn(null, data);
		}
	});
}

module.exports.handler = function(event, context, cb) {
	context.callbackWaitsForEmptyEventLoop = false;
	var email = event.email;
	var password = event.password;

	getUser(email, function(err, data) {
		if (err) {
			p_result.err = "1";
			p_result.message = err;
			return cb(null, p_result);
		} else {
			if (data == null) {
				p_result.err = "1";
				p_result.message = "User not found: " + email;
				return cb(null, p_result);
			} else {
				console.log('Getting token for ' + data.username);
				getToken(email, function(err, data) {
					if (err) {
						p_result.err = "1";
						p_result.message = err;
						return cb(null, p_result);
					} else {
						p_result.p_data = data;
						return cb(null, p_result);
					}
				});
			}
		}
	});
};
