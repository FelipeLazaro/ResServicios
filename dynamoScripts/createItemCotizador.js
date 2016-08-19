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
  TableName: "cotizador",  
  Item: { "plazo": 6,"tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.17","factor_max":"0.18"}  
};

docClient.put(params, function(err, data) {
  if (err)
    console.log(JSON.stringify(err, null, 2));
  else
    console.log(JSON.stringify(data, null, 2));
});