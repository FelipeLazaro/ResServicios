'use strict';
var s3 = require('s3');
var fs= require('fs');

var client = s3.createClient({
  s3Options: {
    "accessKeyId": "AKIAJBRKBNUYNAO35WFA",
    "secretAccessKey": "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",    
    "region": "us-east-1",
  },
});

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
  var tipo_imagen="nulo";
  

  
  if(!event.username || !event.id_estado || !event.calle || !event.codigo_postal || !event.estado || !event.delegacion_municipio || !event.colonia || !event.comprobante_ife){
    
    return cb(null, {
      err:1,
      message: 'agrege toda la informacion necesaria'
    });
    
    
  }
  else{
  
  if(event.comprobante_ife!="1"){
    if(event.subir_despues!="1"){
    if(!event.img_comprobante_domicilio){
      return cb(null, {
        err:1,
        message: 'agrege una imagen como comprobante de domicilio'
      });
    }
    else{
      
     //( var bitmap = new Buffer(event.img_comprobante_domicilio, 'base64');
      
      var dato_img = (event.img_comprobante_domicilio).split(",");
      if(dato_img.length>1){
          var bitmap = new Buffer(dato_img[1], 'base64');
          var tipo_imagen =dato_img[0];
      }
      else{var bitmap = new Buffer(event.img_comprobante_domicilio, 'base64');
      var tipo_imagen ="nulo";}
      
      
      fs.writeFileSync("/tmp/imgcomprobante.jpg", bitmap);
      var keyurlfile="prestatario/"+event.username+"/domicilio/comprobante";
      //var description3=event.typefile3;
      
      
      var params3 = {
              localFile: "/tmp/imgcomprobante.jpg",
              s3Params: {
                Bucket: "latasa",
                Key: keyurlfile,
                ACL:"public-read-write",
              },
            };
            var uploader = client.uploadFile(params3);
            uploader.on('error', function(err) {
              console.error("unable to upload:", err.stack);
              
              return cb(null, {
                "err":1,
                "message":"unable to upload: "+err
              });
            });
            uploader.on('progress', function() {
              console.log("progress", uploader.progressMd5Amount,
                        uploader.progressAmount, uploader.progressTotal);
            });
            uploader.on('end', function() {
              console.log("done uploading3");
              });
      
            mimg_comprobante_domicilio=keyurlfile;
    }
    
    
    }else{mimg_comprobante_domicilio="nulo"}
  }
  else{var comprobante_bandera=1;}

  var mcalle=event.calle;
  if(!event.numeroext){var mnumeroext="nulo";}else{var mnumeroext=event.numeroext;}
  if(!event.numeroint){var mnumeroint="nulo";}else{var mnumeroint=event.numeroint;}
  var mcodigo_postal=event.codigo_postal;
  var mid_estado=event.id_estado;
  var mestado=event.estado;
  if((event.ciudad)!=null && (event.ciudad).length>0){var mciudad=event.ciudad;}else{var mciudad="nulo"}

  var mdelegacion_municipio=event.delegacion_municipio;
  var mcolonia=event.colonia;
  var mcomprobante_ife=event.comprobante_ife;

  
  var params = {
          TableName: "prestatario",
          FilterExpression: 'username = :user',
          ExpressionAttributeValues: {
            ':user': event.username
          }
        };

      dynamo.scan(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
              
              return cb(null, {
                "err":1,
                "message":"error en la base "+err
              });
          } 
          else {

              if(data.Count>'0'){
              var corr=data.Items[0].correo;
              var usern=data.Items[0].username;
              if(data.Items[0].solicitud.pantalla<=3){
                var pantalla=4;
               }else {var pantalla=data.Items[0].solicitud.pantalla}
              
              var fecha_mod = new Date().toISOString().replace(/T/, ' ')
              .replace(/\..+/, '');
              
              if(comprobante_bandera=="1"){mimg_comprobante_domicilio=data.Items[0].identificacion[0].url}
              var params = {
                        TableName:"prestatario",
                        Key:{
                        "username": usern,
                        "correo": corr
                            },
                        UpdateExpression: "set domicilio.calle = :calle," +
                        		" domicilio.numeroext = :numeroext," +
                        		" domicilio.numeroint = :numeroint," +
                        		" domicilio.codigo_postal = :codigo_postal," +
                        		" domicilio.estado = :estado," +
                        		" domicilio.id_estado = :id_estado," +
                        		" domicilio.ciudad = :ciudad," +
                        		" domicilio.delegacion_municipio = :delegacion_municipio," +
                        		" domicilio.colonia = :colonia," +
                        		" domicilio.comprobante_ife = :comprobante_ife," +
                        		" domicilio.tipo_imagen = :tipo_imagen, " +
                        		" domicilio.img_comprobante_domicilio = :img_comprobante_domicilio," +
                        		" solicitud.pantalla=:p," +
                            " solicitud.fecha_ultima_actualizacion = :f",
                        ExpressionAttributeValues:{
                            ":calle":mcalle,
                            ":numeroext":mnumeroext,
                            ":numeroint":mnumeroint,
                            ":codigo_postal":mcodigo_postal,
                            ":estado":mestado,
                            ":id_estado":mid_estado,
                            ":ciudad":mciudad,
                            ":delegacion_municipio":mdelegacion_municipio,
                            ":colonia":mcolonia,
                            ":comprobante_ife":mcomprobante_ife,
                            ":img_comprobante_domicilio":mimg_comprobante_domicilio,
                            ":tipo_imagen":tipo_imagen,
                            ":p":pantalla,
                            ":f":fecha_mod
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
                              "message":"domicilio guardado",
                               "p_data":{
                                 "calle":mcalle,
                                 "numeroext":mnumeroext,
                                 "numeroint":mnumeroint,
                                 "codigo_postal":mcodigo_postal,
                                 "estado":mestado,
                                 "ciudad":mciudad,
                                 "id_estado":mid_estado,
                                 "delegacion_municipio":mdelegacion_municipio,
                                 "colonia":mcolonia,
                                 "comprobante_ife":mcomprobante_ife,
                                 "img_comprobante_domicilio":mimg_comprobante_domicilio
                               }
                            });
                        }
                    });
                      }
              else {console.log("no se encontraron datos para el usuario para poder actualizar")
                return cb(null, {
                  "err":1,
                  "message":"no se encontraron datos para el usuario para poder actualizar"
                });  
              }
          }
      });
  
  }
};
