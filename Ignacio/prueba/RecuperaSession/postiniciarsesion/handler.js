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
 
  console.log(event);

  var JSONinput = (event != null)?event:null;

  if(JSONinput != null && JSONinput.hasOwnProperty('user') && JSONinput.hasOwnProperty('password')){

    var JSONSession = {
      TableName: "prestatario",
      FilterExpression : '',
      ExpressionAttributeValues : {':cp' : event.user, ':pass' : event.password}
    };

    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if(!expr.test(event.user)){
      JSONSession.FilterExpression = 'username = :cp and password = :pass';
    }else{
      JSONSession.FilterExpression = 'correo = :cp and password = :pass';
    }

    dynamo.scan(JSONSession,function(err,data){
      if(err){
        console.error("Unable to read item. Error JSON");
        responseData(1,'error al leer en base de datos! '+err,{});
      }else{
        if(data.Count>'0'){
          console.log("obtuve registro : " + data.Count);
          console.log(data.Items[0].username);
          delete data.Items[0].password;
          var responseJSON = validateProperties(data.Items[0]);

          responseData(0,"bienvenido a la tasa",responseJSON);
        }else{
          responseData(1,'no se encontraron registros - error al iniciar sesion',{});
        } 
      }
    });
  }else{
    responseData(1,"Por favor especifique el user y password de su cuenta.",{});
  }


  function jsonEmpty(data,datosPermitidosNull){
    var valorProperty;
    var respuesta = true;
    for(var property in data){
      if(Object.prototype.hasOwnProperty.call(data,property)){
        valorProperty = data[property];
        if(valorProperty === "null" || valorProperty === null || valorProperty === "" || typeof valorProperty === "undefined"){
          if(datosPermitidosNull.indexOf(property) < 0){
            respuesta =  false;
          }      
        }else{
          if(typeof valorProperty === 'object'){
            respuesta = jsonEmpty(valorProperty,datosPermitidosNull);
          }
        }
      }
      if(!respuesta){
        break;
      }
    }
    return respuesta;
  }

  function responseData(error,mensaje,JSONinput){
    return cb(null,{
          err: error,
          message: mensaje,
          p_data: {
            setparams: JSONinput
          }
        });     
  }
  function validateProperties(dataObject){
    for(var property in dataObject){
      if(Object.keys(dataObject[property]).length === 0){
        delete dataObject[property];
      }
    }
    return dataObject;
  }  
}
