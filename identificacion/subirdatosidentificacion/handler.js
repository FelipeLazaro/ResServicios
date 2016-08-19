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
  if((event.url1 && event.description1) || (event.url2 && event.description2) || (event.url3 && event.description3)){
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
            
            var band3=1;
            var band2=1;
            var band1=1;
            
            if(!event.url3 || !event.description3){

              var keyurlfile3="nulo";
              var description3="nulo";
              var band3=0;
            }
            else{ 
            var keyurlfile3=event.url3;
            var description3=event.description3;
            }
            if(!event.url2 || !event.description2){
              var keyurlfile2="nulo";
              var description2="nulo";
              var band2=0;
            }
            else{
            var keyurlfile2=event.url2;
            var description2=event.description2;
            }

            if(!event.url1 || !event.description1){
              var keyurlfile1="nulo";
              var description1="nulo";
              var band1=0;
            }
            else{
            var keyurlfile1=event.url1;
            var description1=event.description1;
            }
    
              if(data.Count>'0'){
              var corr=data.Items[0].correo;
              var usern=data.Items[0].username;

              if(band1==0){
                if(data.Items[0].identificacion.file1){
                  var keyurlfile1=data.Items[0].identificacion.file1;
                  var description1=data.Items[0].identificacion.typefile1;
                }
              }
              if(band2==0){
                if(data.Items[0].identificacion.file2){
                var keyurlfile2=data.Items[0].identificacion.file2;
                var description2=data.Items[0].identificacion.typefile2;
                }
                }
              if(band3==0){
                if(data.Items[0].identificacion.file3){
                var keyurlfile3=data.Items[0].identificacion.file3;
                var description3=data.Items[0].identificacion.typefile3;
                }
                }
              
       
              var params = {
                        TableName:"prestatario",
                        Key:{
                        "username": usern,
                        "correo": corr
                            },
                        UpdateExpression: "set identificacion.file1 = :r, identificacion.typefile1 = :f, identificacion.file2 = :rr, identificacion.typefile2 = :ff, identificacion.file3 = :rrr, identificacion.typefile3 = :fff",
                        ExpressionAttributeValues:{
                            ":r":keyurlfile1,
                            ":f":description1,
                            ":rr":keyurlfile2,
                            ":ff":description2,
                            ":rrr":keyurlfile3,
                            ":fff":description3
                        },
                        ReturnValues:"UPDATED_NEW"
                    };

                    console.log("Updating the item...");
                  
                    dynamo.update(params, function(err, data) {
                        if (err) {
                            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                            return cb(null, {
                              "err":1,
                              "message":"error al guardar identificacion "+err,
                              "vars":{"ur1":"file1 "+keyurlfile1,
                                "url2":"file2-"+keyurlfile2,
                                "url3":"file3"+keyurlfile3}
                            });
                        } else {
                            return cb(null, {
                              "err":0,
                              "message":"identificacion guardada",
                              "vars":{
                                "url1":"file1 "+keyurlfile1,
                                "url2":"file2-"+keyurlfile2,
                                "url3":"file3"+keyurlfile3}
                            });
                        }
                                });
              }
              else {console.log("no se encontraron datos para el usuario para poder actualizar")
                return cb(null, {
                  "err":1,
                  "message":"no se encontraron datos en la base para el usuario para poder actualizar"
                });  
              }
          }
      });
  }
  else{
    
    return cb(null, {
      "err":1,
      "message":"no hay informacion de identificacion para agregar o actualizar"
    });  
  }
  
  
};
