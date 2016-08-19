/**
 * Script para crear la tabla con las tasas y factores aplicados por plazo
 */
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});

var dynamodb = new AWS.DynamoDB();

var tblCotizador = {
        "TableName": "cotizador",
        "KeySchema": [{
          "AttributeName": "version",
          "KeyType": "HASH"
        }, {
          "AttributeName": "plazo",
          "KeyType": "RANGE"
        }],
        "AttributeDefinitions": [{
          "AttributeName": "version",
          "AttributeType": "N"
        }, {
          "AttributeName": "plazo",
          "AttributeType": "N"
        }],
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 1,
          "WriteCapacityUnits": 1
        }
      };
dynamodb.createTable(tblCotizador, function(err, data) {
  if (err)
    console.log(JSON.stringify(err, null, 2));
  else
    console.log(JSON.stringify(data, null, 2));
});