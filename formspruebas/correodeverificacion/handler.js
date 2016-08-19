'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});

      

var dynamo = new AWS.DynamoDB.DocumentClient();
module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var mtoken=event.token; var use=[{valor:false}]; 

  var params = {
TableName: "correo_resuelve_verifica",
FilterExpression : 'new_token = :cp',
ExpressionAttributeValues : {':cp' : mtoken}
};

dynamo.scan(params, function(err, data) {
if (err) {
    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    var p_data={p_data:{
        success:"0",
        error:"1",
        message:"hubo algun error en el servidor vuelva a intentarlo mas tarde!!!!!!! "
      }}
    return cb(null, {
      p_data
    });
} 
else {
    if(data.Count>'0'){console.log("obtuve registro : "+data.Count)
      console.log("estatus del correo a verificar"+data.Items[0].estatus);
    if(data.Items[0].estatus==1){
      var p_data={p_data:{
        success:"0",
        error:"1",
        message:"usted ya verifico su correo - inicie session para continuar"
      }}
      return cb(null, {
        p_data
      });}
      else{
        var params = {
               TableName:"correo_resuelve_verifica",
                "Key": {
               "new_token": mtoken
             },
               UpdateExpression: "set estatus = :st",
               ExpressionAttributeValues:{
                  ":st":1
              },
           ReturnValues:"ALL_NEW"
        };

      console.log("actualizando status correo de usuario...");
      dynamo.update(params, function(err, data) {
          if (err) {
             console.error("hay algun error al actualizar el status:", JSON.stringify(err, null, 2));
             var p_data={p_data:{
              success:"0",
        error:"1",
        message:"hubo algun error en el servidor vuelva a intentarlo mas tarde!!!!!!! "
      }}
             return cb(null, {
               p_data
             });
                } else {
               console.log("actualizacion de status de correo correcto correcto:", JSON.stringify(data, null, 2));
               var p_data={p_data:{
               success:"1",
               error:"0",
                message:"verificación de correo exitoso - inicie session para continuar"
                }}
                //res.send(p_data)
               return cb(null, {
                 p_data
               });
           }
      });
    }
}
      else{console.log("no existe token generado para el usuario")
        var p_data={p_data:{
          success:"0",
        error:"1",
        message:"no existe url a verificar"
      }}
      return cb(null, {
        p_data
      });
    }
        console.log("datos obtenidos");
        console.log(data)

    //}
}
});   
  
  
};
