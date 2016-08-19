var suid = require('rand-token').suid;
var AWS = require("aws-sdk");


AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var token = suid(16);
var params = {
    TableName: "correo_resuelve_verifica",
    Item: {
      new_token:token,      
      username:"mike",
      estatus:0
      }
    };

 console.log("correo enviado")
 console.log("http://localhost:3000/servicio_envio_de_correo_/"+token)

docClient.put(params, function(err, data) {
    if (err)
        console.log(JSON.stringify(err, null, 2));
    else
        console.log(JSON.stringify(data, null, 2));
});