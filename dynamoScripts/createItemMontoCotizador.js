/**
 * http://usejsdoc.org/
 */

var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
  TableName: "monto_cotizador",
  Item: {
    "version": 1,
    "monto_minimo":20000,
    "monto_maximo":350000,
    "intervalo":5000
  }
};

docClient.put(params, function(err, data) {
  if (err)
    console.log(JSON.stringify(err, null, 2));
  else
    console.log(JSON.stringify(data, null, 2));
});
