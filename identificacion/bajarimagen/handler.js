'use strict';
var s3 = require('s3');
var fs = require('fs');

var AWS = require('aws-sdk');
var dynamoDBConf = {
"accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
    "secretAccessKey": "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",    
    "region": "us-east-1",
}
AWS.config.update(dynamoDBConf);
var dynamo = new AWS.DynamoDB.DocumentClient();

//function to encode file data to base64 encoded string

var client = s3.createClient({
  s3Options: {
    "accessKeyId": "AKIAJBRKBNUYNAO35WFA",
    "secretAccessKey": "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",    
    "region": "us-east-1",
  },
});

module.exports.handler = function(event, context, cb) {
  if(!event.bajarimagen){
    return cb(null, {
      err:1,
      message: "debe argregar el url de la imagen"
    });
    
  }
  else{
    
    if(!event.username){
      return cb(null, {
        err:1,
        message: "debe argregar el usuario"
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
              
              
              var params = {
                      localFile:"/tmp/imagen.jpg",

                      s3Params: {
                        Bucket: "latasa",
                        Key: event.bajarimagen,
                      },
                };
        var downloader = client.downloadFile(params);
        downloader.on('error', function(err) {
          console.error("unable to download:", err.stack);
          return cb(null, {
            err:1,
            message: "unable to download:"+err.stack
          });
        });
        downloader.on('progress', function() {
          console.log("progress", downloader.progressAmount, downloader.progressTotal);
        });
        downloader.on('end', function() {
          console.log("done downloading");
          // read binary data
          var bitmap = fs.readFileSync("/tmp/imagen.jpg");
          console.log(new Buffer(bitmap).toString('base64'))
          
          var tipo_de_imagen="nulo";
          var hoja_imagen=(event.bajarimagen).split("/");
          
          console.log("hoja imagen :"+hoja_imagen[2])
          
          if(hoja_imagen[2]=="domicilio"){
            var tipo_de_imagen=data.Items[0].domicilio.tipo_imagen;
          }
          else{
          for(var i=0;i<(data.Items[0].identificacion).length;i++){
          if(event.bajarimagen==data.Items[0].identificacion[i].url){
            if(data.Items[0].identificacion[i].tipo_archivo){
            var tipo_de_imagen=data.Items[0].identificacion[i].tipo_archivo;}
          }
          }
          }
          return cb(null, {
            err:0,
            message: "",
            p_data: {
             tipo_imagen: tipo_de_imagen,
             b64:new Buffer(bitmap).toString('base64')

              }
          });
        });
  
  }
        
        });
    }
  }
};
