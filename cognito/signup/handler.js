'use strict';
console.log('Loading function...');
var AWS = require('aws-sdk');

var cognitoidentityprovider = new AWS.CognitoIdentityServiceProvider({
    "accessKeyId": "AKIAI3AZINYLLVNTOB6A",
    "secretAccessKey": "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",
    "region": "us-east-1"

});

var p_result = {
    "err": "0",
    "message": "",
    "p_data": {}
};

function createUser(user, fn) {
    var paramsNewUser = {
        //aqui usamos el id de la aplicacion elegida
        ClientId: "33qbgccbo07jah1gpk7p8lv5sv",
        Username: user.username,
        Password: user.password,
        UserAttributes: [
            {
                Name: "email",
                Value: user.email
            }, {
                Name: 'family_name',
                Value: user.family_name
            },
            {
                Name: 'name',
                Value: user.name
            },
        ],

    };
    cognitoidentityprovider.signUp(paramsNewUser, function (err, data) {
        if (err) {
            return fn(err);
        } else {
            fn(null, data)
        }

    });

}

module.exports.handler = function (event, context, cb) {
    context.callbackWaitsForEmptyEventLoop = false;

    var userParams = {
        "username": event.username,
        "email": event.email,
        "password": event.password,
        "family_name": event.apaterno,
        "name": event.nombre
    }

    createUser(userParams, function (err, data) {
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
