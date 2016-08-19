'use strict';
var s3 = require('s3');
var fs= require('fs');
var sleep = require('sleep-async')();

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
   if(!event.username){
     return cb(null, {
       "err":1,
       "message":"debe agregar nombre de usuario"
     });  
   }
   else{  
    
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
                    else if(parseInt(data.Count) < 1) {
                      return cb(null, {
                        "err":1,
                        "message":"error, no hay usuario registrado con ese nick"
                      });
                    }
                    else {
                      /////////////////s3
                      if(!event.file1 || !event.typefile1){
                        var keyurlfile1="nulo";
                        var description1="nulo";
                       }
                       else{                     
                         var datosss = (event.file1).split(",");
                         if(datosss.length>1){
                         var bitmap1 = new Buffer(datosss[1], 'base64');
                         var tipo_imagen1 =datosss[0];
                     }
                     else{
                       var bitmap1 = new Buffer(event.file1, 'base64');
                     var tipo_imagen1 ="nulo";}
                         fs.writeFileSync("/tmp/archivoimg1.jpg", bitmap1);
                         var keyurlfile1="prestatario/"+event.username+"/identificacion/file1";
                         var description1=event.typefile1;
                         
                         var params1 = {
                                 localFile: "/tmp/archivoimg1.jpg",
                                 s3Params: {
                                   Bucket: "latasa",
                                   Key: keyurlfile1,
                                   ACL:"public-read-write",
                                 },
                               };
                               var uploader = client.uploadFile(params1);
                               uploader.on('error', function(err) {
                                 console.error("unable to upload 1 :", err.stack);
                                 
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
                                 console.log("done uploading 1");
                                 });
                       }//end 1 s3
                      
                      if(!event.file2 || !event.typefile2){
                        var keyurlfile2="nulo";
                        var description2="nulo";
                       }
                       else{
                         var datosss = (event.file2).split(",");
                         if(datosss.length>1){
                             var bitmap2 = new Buffer(datosss[1], 'base64');
                             var tipo_imagen2 =datosss[0];
                         }
                         else{var bitmap2 = new Buffer(event.file2, 'base64');
                         var tipo_imagen2 ="nulo";}
                         fs.writeFileSync("/tmp/archivoimg2.jpg", bitmap2);
                         var keyurlfile2="prestatario/"+event.username+"/identificacion/file2";
                         var description2=event.typefile2;
                         
                         var params2 = {
                                 localFile: "/tmp/archivoimg2.jpg",
                                 s3Params: {
                                   Bucket: "latasa",
                                   Key: keyurlfile2,
                                   ACL:"public-read-write",
                                 },
                               };
                               var uploader = client.uploadFile(params2);
                               uploader.on('error', function(err) {
                                 console.error("unable to upload 2 :", err.stack);
                                 
                                 return cb(null, {
                                   "err":1,
                                   "message":"unable to upload 2: "+err
                                 });
                               });
                               uploader.on('progress', function() {
                                 console.log("progress", uploader.progressMd5Amount,
                                           uploader.progressAmount, uploader.progressTotal);
                               });
                               uploader.on('end', function() {
                                 console.log("done uploading 2");
                                 });
                       }//end 2 s3
                      
                      if(!event.file3 || !event.typefile3){
                       var keyurlfile3="nulo";
                       var description3="nulo";
                       var tipo_imagen3 ="nulo";
                      }
                      else{
                        var datosss = (event.file3).split(",");
                        if(datosss.length>1){
                            var bitmap3 = new Buffer(datosss[1], 'base64');
                            var tipo_imagen3 =datosss[0];
                        }
                        else{var bitmap3 = new Buffer(event.file3, 'base64');
                        var tipo_imagen3 ="nulo";}
                        fs.writeFileSync("/tmp/archivoimg3.jpg", bitmap3);
                        var keyurlfile3="prestatario/"+event.username+"/identificacion/file3";
                        var description3=event.typefile3;
                        
                        var params3 = {
                                localFile: "/tmp/archivoimg3.jpg",
                                s3Params: {
                                  Bucket: "latasa",
                                  Key: keyurlfile3,
                                  ACL:"public-read-write",
                                },
                              };
                              var uploader = client.uploadFile(params3);
                              uploader.on('error', function(err) {
                                console.error("unable to upload 3:", err.stack);
                                
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
                                console.log("done uploading 3");
                                });
                      }//end 3 s3
                      
                      ////////////////s3
                      
                      console.log(description1);
                      console.log(description2);
                      console.log(description3);
                      
                      console.log(keyurlfile1);
                      console.log(keyurlfile2);
                      console.log(keyurlfile3);
                      
                        if(data.Count>'0'){
                        var corr=data.Items[0].correo;
                        var usern=data.Items[0].username;
                        if(data.Items[0].solicitud.pantalla<=2){
                         var pantalla=3;
                        }else {var pantalla=data.Items[0].solicitud.pantalla}
                        
                        
                        if(!event.file1 || !event.typefile1){
                          if(!data.Items[0].identificacion[0].url){
                          var keyurlfile1="nulo";
                          var description1="nulo";
                          var tipo_imagen1="nulo";
                          }else{
                            var keyurlfile1=data.Items[0].identificacion[0].url;
                            var description1=data.Items[0].identificacion[0].description;
                            var tipo_imagen1=data.Items[0].identificacion[0].tipo_archivo;
                           
                          }
                         }
                        
                        if(!event.file2 || !event.typefile2){
                          if(!data.Items[0].identificacion[1].url){
                          var keyurlfile2="nulo";
                          var description2="nulo";
                          var tipo_imagen2="nulo";
                          }else{
                            var keyurlfile2=data.Items[0].identificacion[1].url;
                            var description2=data.Items[0].identificacion[1].description;
                            var tipo_imagen2=data.Items[0].identificacion[1].tipo_archivo;
                          }
                         }
                        
                        if((!event.file3 || !event.typefile3) && (data.Items[0].solicitud.pantalla>2)){
                          if(!data.Items[0].identificacion[2].url){
                          var keyurlfile3="nulo";
                          var description3="nulo";
                          var tipo_imagen3="nulo";
                          }else{
                            var keyurlfile3=data.Items[0].identificacion[2].url;
                            var description3=data.Items[0].identificacion[2].description;
                            if(data.Items[0].identificacion[2].url=="nulo"){
                              var tipo_imagen3="nulo"
                            }
                            else{var tipo_imagen3=data.Items[0].identificacion[2].tipo_archivo;}
                          }
                         }
                        
                        var identificacion=[];
                        var file = {
                                "url": keyurlfile1,
                                "description":description1,
                                "tipo_archivo": tipo_imagen1
                              };
                        identificacion.push(file);
                        var file = {
                                "url": keyurlfile2,
                                "description":description2,
                                "tipo_archivo": tipo_imagen2
                              };
                        identificacion.push(file);
                        var file3 = {
                                "url": keyurlfile3,
                                "description":description3,
                                "tipo_archivo": tipo_imagen3
                              };
                        identificacion.push(file3);
                        
                        var fecha_mod = new Date().toISOString().replace(/T/, ' ')
                        .replace(/\..+/, '');
                        
                        var params = {
                                  TableName:"prestatario",
                                  Key:{
                                  "username": usern,
                                  "correo": corr
                                      },
                                  UpdateExpression: "set identificacion = :r," +
                                  		" solicitud.pantalla=:p," +
                                  		" solicitud.fecha_ultima_actualizacion = :f",
                                  ExpressionAttributeValues:{
                                      ":r":identificacion,
                                      ":p":pantalla,
                                      ":f":fecha_mod
                                  },
                                  ReturnValues:"UPDATED_NEW"
                              };

                              console.log("Updating the item...");
                            
                              sleep.sleep(5000, function(next){  dynamo.update(params, function(err, data) {
                                  if (err) {
                                      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                                      return cb(null, {
                                        "err":1,
                                        "message":"error al guardar identificacion "+err
                                      });
                                  } else {
                                  
                                   // var filem = [];
                                   
                                      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                                      return cb(null, {
                                        "err":0,
                                        "message":"identificacion guardada",
                                         "p_data":identificacion
                                      });
                                  }
                              });});
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
