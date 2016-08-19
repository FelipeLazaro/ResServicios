/**
 * Script para crear la tabla con los montos minimo y maximo, ademas del intervalo
 */
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});

var dynamodb = new AWS.DynamoDB();
var tblCotizador = {
  "TableName": "monto_cotizador",
  "KeySchema": [{
    "AttributeName": "version",
    "KeyType": "RANGE"
  }],
  "AttributeDefinitions": [{
    "AttributeName": "version",
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