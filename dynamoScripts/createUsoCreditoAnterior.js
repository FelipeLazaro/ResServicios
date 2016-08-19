/**
 * Script para crear la tabla con los usos del credito anterior
 */
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});

var dynamodb = new AWS.DynamoDB();

var tblUsoCreditoAnterior = {
        "TableName": "usoCreditoAnterior",
        "KeySchema": [{
          "AttributeName": "version",
          "KeyType": "HASH"
        }, {
          "AttributeName": "id",
          "KeyType": "RANGE"
        }],
        "AttributeDefinitions": [{
          "AttributeName": "version",
          "AttributeType": "N"
        }, {
          "AttributeName": "id",
          "AttributeType": "N"
        }],
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 1,
          "WriteCapacityUnits": 1
        }
      };
dynamodb.createTable(tblUsoCreditoAnterior, function(err, data) {
  if (err)
    console.log(JSON.stringify(err, null, 2));
  else
    console.log(JSON.stringify(data, null, 2));
});