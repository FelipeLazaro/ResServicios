/**
 * Script para crear la tabla prestatario en dynamo
 */
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});
var dynamodb = new AWS.DynamoDB();
var tblPrestatarioParams = {
  "TableName": "prestatario",
  "KeySchema": [{
    "AttributeName": "correo",
    "KeyType": "HASH"
  }, {
    "AttributeName": "username",
    "KeyType": "RANGE"
  }],
  "AttributeDefinitions": [{
    "AttributeName": "correo",
    "AttributeType": "S"
  }, {
    "AttributeName": "username",
    "AttributeType": "S"
  }],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 1,
    "WriteCapacityUnits": 1
  }
};

dynamodb.createTable(tblPrestatarioParams, function(err, data) {
  if (err)
    console.log(JSON.stringify(err, null, 2));
  else
    console.log(JSON.stringify(data, null, 2));
});