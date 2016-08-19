'use strict';

var AWS = require('aws-sdk');
var dynamoDBConf = {
"accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
    "secretAccessKey": "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",    
    "region": "us-east-1"
}
AWS.config.update(dynamoDBConf);
var dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
 
  console.log(event)
  
  if (!event.user || !event.password) {

    return cb(null, {err:1,
      message:"Por favor especifique el user y password de su cuenta.",
      p_data:{}});
  }
  
  else if(event.user.length < 1 || event.password.length < 1){
    console.log("error de lectura, agregue informacion necesaria")
    return cb(null, {
        err:1,
        message:"error al leer, llene toda la informacion solicitada",
        p_data:{}
    });  
  }
  else{
    
    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!expr.test(event.user)) {
      var params = {
              TableName: "prestatario",
              FilterExpression : 'username = :cp and password = :pass',
              ExpressionAttributeValues : {':cp' : event.user, ':pass' : event.password}
          };
    }
    else{
      
      var params = {
              TableName: "prestatario",
              FilterExpression : 'correo = :cp and password = :pass',
              ExpressionAttributeValues : {':cp' : event.user, ':pass' : event.password}
          };
    }
    
  
  
  dynamo.scan(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON");
        return cb(null, {
          err:1,
          message: 'error al leer en base de datos!'+err,
          p_data:{}
        });
    } 
    else {
        if(data.Count>'0'){console.log("obtuve registro : "+data.Count)
          console.log(data.Items[0].username);
          
          return cb(null, {
            err:0,
            message:"bienvenido a la tasa", 
            p_data:{
              username:data.Items[0].username,
              solicitud:data.Items[0].solicitud,
              perfil:data.Items[0].perfil
            }
          });  }
          else{console.log("no se encontraron registros")
            return cb(null, {
              err:1,
              message: 'no se encontraron registros - error al iniciar sesion',
              p_data:{}
            });}

        
       
    }
  
 
  });
  }
}
