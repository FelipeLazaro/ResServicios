var AWS = require("aws-sdk");


AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "correo_resuelve_verifica",
    KeySchema: [       
        { AttributeName: "new_token", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "new_token", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err)
        console.log(JSON.stringify(err, null, 2));
    else
        console.log(JSON.stringify(data, null, 2));
        }
);