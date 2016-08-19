
var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});


var docClient = new AWS.DynamoDB.DocumentClient()

var params = {
    "TableName": "cotizador"
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