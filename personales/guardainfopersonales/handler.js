'use strict';

var AWS = require('aws-sdk');
var dynamoDBConf = {
"accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
    "secretAccessKey": "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",    
    "region": "us-east-1",
}
AWS.config.update(dynamoDBConf);
var dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  var comprobante_bandera=0;
  var mimg_comprobante_domicilio;
  var keyurlfile;
  
  if((event.prestatario_alta.identificacion.files).length==0 || !event.username || !event.prestatario_alta.identificacion.lugar_nacimiento || !event.prestatario_alta.identificacion.fecha_nacimiento || !event.prestatario_alta.identificacion.rfc_homoclave || !event.prestatario_alta.identificacion.estado_civil || !event.prestatario_alta.identificacion.type_id){    
    return cb(null, {
      err:1,
      message: 'agrege toda la informacion necesaria'
    });
  }
  else{
  var mnacionalidad=event.prestatario_alta.identificacion.lugar_nacimiento;
  if(!event.prestatario_alta.identificacion.telefono_fijo){var mtelefono_fijo="nulo";}else{var mtelefono_fijo=event.prestatario_alta.identificacion.telefono_fijo;}
  if(!event.prestatario_alta.identificacion.celular){var mcelular="nulo";}else{var mcelular=event.prestatario_alta.identificacion.celular;}
  var mfecha_nacimiento=event.prestatario_alta.identificacion.fecha_nacimiento;

  var mrfc=event.prestatario_alta.identificacion.rfc_homoclave;
  var mestado_civil=event.prestatario_alta.identificacion.estado_civil;
  var mtype_id= event.prestatario_alta.identificacion.type_id;
  
  var mfiles=[];
  
  for (var i=0;i<(event.prestatario_alta.identificacion.files).length;i++)
	  {
	  
	  var p_item = {
		        "description": event.prestatario_alta.identificacion.files[i].description,
		        "url": event.prestatario_alta.identificacion.files[i].url
		      };
		      mfiles.push(p_item);
	  }
  
  var params = {
          TableName: "prestatario",
          FilterExpression: 'username = :user',
          ExpressionAttributeValues: {
            ':user': event.username
          }
        };

      dynamo.scan(params, function(err, data) {
          if (err) {  
              return cb(null, {
                "err":1,
                "message":"error en la base "+err
              });
          } 
          else {
              if(data.Count>'0'){
              var corr=data.Items[0].correo;
              var usern=data.Items[0].username;
		              if(data.Items[0].solicitud.pantalla<=2){
		                var pantalla=3;
		               }else {var pantalla=data.Items[0].solicitud.pantalla}
              
			              var fecha_mod = new Date().toISOString().replace(/T/, ' ')
			              .replace(/\..+/, '');
              
              var params = {
                        TableName:"prestatario",
                        Key:{
                        "username": usern,
                        "correo": corr
                            },
                        UpdateExpression: "set identificacion.lugar_nacimiento = :nacionalidad," +
                            " identificacion.telefono_fijo = :telefono_fijo," +
                            " identificacion.celular = :celular," +
                            " identificacion.fecha_nacimiento = :fecha_nacimiento," +
                            " identificacion.rfc_homoclave = :rfc," +
                            " identificacion.estado_civil = :estado_civil," +
                            " solicitud.pantalla=:p," +
                            " solicitud.fecha_ultima_actualizacion = :f," +
                            " identificacion.files = :files," +
                            " identificacion.type_id = :type_id",
                        ExpressionAttributeValues:{
                            ":nacionalidad":mnacionalidad,
                            ":telefono_fijo":mtelefono_fijo,
                            ":celular":mcelular,
                            ":fecha_nacimiento":mfecha_nacimiento,
                            ":rfc":mrfc,
                            ":estado_civil":mestado_civil,
                            ":p":pantalla,
                            ":f":fecha_mod,
                            ":files": mfiles,
                            ":type_id": mtype_id,
                        },
                        ReturnValues:"UPDATED_NEW"
                    };

                    console.log("Updating the item...");
                  
                    dynamo.update(params, function(err, data) {
                        if (err) {
                            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                            return cb(null, {
                              "err":1,
                              "message":"error al guardar identificacion "+err
                            });
                        } else {
                            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                            return cb(null, {
                              "err":0,
                              "message":"datos personales guardados",
                               "p_data":{
                                 "nacionalidad":mnacionalidad,
                                 "telefono_fijo":mtelefono_fijo,
                                 "celular":mcelular,
                                 "fecha_nacimiento":mfecha_nacimiento,
                                 "rfc":mrfc,
                                 "estado_civil":mestado_civil,
                                 "files":mfiles,
                                 "type_id": mtype_id                            
                               }
                            });
                        }
                    });
                      }
              else {
                return cb(null, {
                  "err":1,
                  "message":"no se encontraron datos para el usuario para poder actualizar"
                });  
              }
          }
      });
  }
};
