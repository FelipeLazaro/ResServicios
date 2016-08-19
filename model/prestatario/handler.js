'use strict';
var AWS = require('aws-sdk');

var dynamoDBConf = {
  "accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
  "secretAccessKey": "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",
  "region": "us-east-1",
};

AWS.config.update(dynamoDBConf);

var dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = function(event, context, cb) {

  context.callbackWaitsForEmptyEventLoop = false;
  var params = {
    TableName: "prestatario",
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': event.username
    }
  };

  dynamo.scan(params, function(err, data) {
    if (err) { return cb(null, {
      message: err
    }); }

    return cb(null, {
      message: data
    });
  });

};