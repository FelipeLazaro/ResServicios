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
    RequestItems: { 
        "cotizador": [ 


    {PutRequest:{Item: {"plazo":21,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
    {PutRequest:{Item: {"plazo":22,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
    {PutRequest:{Item: {"plazo":23,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
    {PutRequest:{Item: {"plazo":24,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
    {PutRequest:{Item: {"plazo":25,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
    {PutRequest:{Item: {"plazo":26,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.06"}}},
    {PutRequest:{Item: {"plazo":27,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":28,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":29,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":30,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":31,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":32,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":33,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":34,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
    {PutRequest:{Item: {"plazo":35,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.03","factor_max":"0.05"}}},        
    {PutRequest:{Item: {"plazo":36,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.03","factor_max":"0.05"}}}
        ],
    },
    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
    ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};

docClient.batchWrite(params, function(err, data) {
    if (err) console.log(data); // an error occurred
    else console.log(data) // successful response
});