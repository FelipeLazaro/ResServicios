
var AWS = require("aws-sdk");
var dynamoDBConf = {
        "accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
        "secretAccessKey": "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",
        "region": "us-east-1",
      };
AWS.config.update(dynamoDBConf);

var docClient = new AWS.DynamoDB.DocumentClient()

var params = {
    "TableName": "usoCreditoAnterior",    
    "FilterExpression":"version=:version",
    "ExpressionAttributeValues":{
      ":version":20160516
    }
};

docClient.scan(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } 
    else {
     // if(data.Count==0){console.log("no se encontro informacion en la base de datos")

      //}
       // else{
            console.log("datos obtenidos");
            console.log(data)
        //}
    }
});