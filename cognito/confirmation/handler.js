'use strict';
console.log('Loading function...');
var AWS = require('aws-sdk');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'RyHpp4ji';
var	extra = 'resuelve';


var cognitoidentityprovider = new AWS.CognitoIdentityServiceProvider({
	"accessKeyId" : "AKIAI3AZINYLLVNTOB6A",
	"secretAccessKey" : "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",
	"region" : "us-east-1"

});

var p_result = {
	"err" : "0",
	"message" : "",
	"p_data" : {}
};

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function confirmUser(user, fn) {
	var paramsConfirmation = {
		// aqui usamos el id de la aplicacion elegida
		ClientId : "33qbgccbo07jah1gpk7p8lv5sv",
		ConfirmationCode : user.code,
		Username : user.username
	};

	cognitoidentityprovider.confirmSignUp(paramsConfirmation, function(err,
			data) {
		if (err) {
			return fn(err);
		} else {
			fn(null, data)
		}

	});

}

module.exports.handler = function(event, context, cb) {
	context.callbackWaitsForEmptyEventLoop = false;
	if(event == null || !event.username || !event.code || isNaN(event.code)){
		console.log("Parametros invalidos");
		p_result.err = "1";
		p_result.message = "Parametros invalidos";
		return cb(null, p_result);
	}
    var code = event.code;
	var texto = decrypt(event.username);
	var params = texto.split("-");
	
	if(!params || params.length != 2 || params[1] !== extra){
		console.log("Peticion de confirmacion invalida");
		p_result.err = "1";
		p_result.message = "Peticion de confirmacion invalida";
		return cb(null, p_result);
	}
	
	
	var userParams = {
		"username" : params[0],
		"code" : code
	}
	console.log("confirmando a " + params[0] + " con code " + code);
	confirmUser(userParams, function(err, data) {
		if (err) {
			console.log(err);
			p_result.err = "1";
			p_result.message = err;
			return cb(null, p_result);
		} else {
			p_result.p_data = data;
			return cb(null, p_result);
		}
	});
};
