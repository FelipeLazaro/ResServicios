'use strict';

var s3 = require('s3');
var fs= require('fs');




module.exports.handler = function(event, context, cb) {
  var client = s3.createClient({
    s3Options: {
      "accessKeyId": "AKIAJBRKBNUYNAO35WFA",
      "secretAccessKey": "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",    
      "region": "us-east-1",
    },
  });
  
  if(!event.file || !event.numfile || !event.username){
    

    return cb(null, {
      message: 'no ha mandado ningun archivo o no sus especificaciones: tipo y numero de imagen'
    });
   }
  else if (event.numfile=="file1" || event.numfile=="file2" || event.numfile=="file3"){
    var bitmap3 = new Buffer(event.file, 'base64');
    fs.writeFileSync('/tmp/imagenidentificacion.jpg', bitmap3);
    var keyurlfile3="prestatario/"+event.username+"/identificacion/"+event.numfile;
    var description3=event.typefile;
    
    var params3 = {
            localFile:'/tmp/imagenidentificacion.jpg',
            s3Params: {
              Bucket: "latasa",
              Key: keyurlfile3,
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
            return cb(null, {
              err:0,
              message:"",
              p_data:{
                urlgenerada:keyurlfile3
              }
            });
            });
    
    
   
  }
   else{
     return cb(null, {
       message: 'en numfile debe especificar file1, file2, o file3'
     });
     
   }
  
  
 
};
