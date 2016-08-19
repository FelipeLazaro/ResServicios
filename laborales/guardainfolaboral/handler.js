'use strict';

var AWS = require('aws-sdk');
var dynamoDBConf = {
"accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
    "secretAccessKey": "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",    
    "region": "us-east-1",
}
AWS.config.update(dynamoDBConf);
var dynamo = new AWS.DynamoDB.DocumentClient();

var s3 = require('s3');
var fs= require('fs');

var client = s3.createClient({
  s3Options: {
    "accessKeyId": "AKIAJBRKBNUYNAO35WFA",
    "secretAccessKey": "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",    
    "region": "us-east-1",
  },
});

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event)
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
                     var corr=data.Items[0].correo;
                     var usern=data.Items[0].username;
                     
                     if(data.Items[0].solicitud.pantalla<=5){
                       var pantalla=6;
                      }else {var pantalla=data.Items[0].solicitud.pantalla}
                     
                     var fecha_mod = new Date().toISOString().replace(/T/, ' ')
                     .replace(/\..+/, '');
  
                     
 var msector="nulo";
 var mtipo_contratacion="nulo";
 var mactividad_profesional="nulo";
 var mtiempo_empleo_actual="nulo";
 var mnivelestudios="nulo";
 var mingreso_mensual_libre="nulo";
 var mtipo_comprobante="nulo";
 var mimg_comprobante_ingresos="nulo";
 var mgastos_mensuales="nulo";
 var mtiempo_actividad="nulo";
 var mcomo_recibes_ingresos="nulo";
  
  if(!event.ocupacion || !event.username){
    return cb(null, {
      err:1,
      message: 'no has mandado ocupacion (empleado, empresario, u otro), o usuario'
    });
  }
  else if(!event.comprobante[0].img_comprobante_ingresos || !event.comprobante[0].tipo_comprobante){
    return cb(null, {
      err:1,
      message: 'debes agregar un comprobante de ingresos con su informacion'
    });    
  }
  else if(event.ocupacion=="empleado" && (!event.sector || !event.tipo_contratacion || !event.actividad_profesional || !event.tiempo_empleo_actual || !event.nivelestudios || !event.ingreso_mensual_libre)){
    return cb(null, {
      err:1,
      message: 'agregue toda la informacion para empleado'
    }); 
  }
  else if(event.ocupacion=="empresario" && (!event.actividad_profesional || !event.nivelestudios || !event.ingreso_mensual_libre || !event.gastos_mensuales || !event.tiempo_actividad)){
    return cb(null, {
      err:1,
      message: 'agregue toda la informacion para empresario'
    }); 
  }
  else if(event.ocupacion=="otro" && (!event.nivelestudios || !event.ingreso_mensual_libre || !event.como_recibes_ingresos)){
    return cb(null, {
      err:1,
      message: 'agregue toda la informacion para otro'
    }); 
  }
  
  
  else{
    if(event.ocupacion!="empleado" && event.ocupacion!="empresario" && event.ocupacion!="otro"){
      return cb(null, {
        err:1,
        message: 'ocupacion no identificada, use empleado, empresario u otro'
      }); 
    }
    
    else{
    
    if(event.ocupacion=="empleado"){
          msector=event.sector;
          mtipo_contratacion=event.tipo_contratacion;
          mactividad_profesional=event.actividad_profesional;
          mnivelestudios=event.nivelestudios;
          mtiempo_empleo_actual=event.tiempo_empleo_actual;
          mingreso_mensual_libre=event.ingreso_mensual_libre;
         
    }
    if(event.ocupacion=="empresario"){
      mactividad_profesional=event.actividad_profesional;
      mnivelestudios=event.nivelestudios;
      mingreso_mensual_libre=event.ingreso_mensual_libre;
      mgastos_mensuales=event.gastos_mensuales;
      mtiempo_actividad=event.tiempo_actividad;
    }

    if(event.ocupacion=="otro"){
      mnivelestudios=event.nivelestudios;
      mingreso_mensual_libre=event.ingreso_mensual_libre;
      mcomo_recibes_ingresos=event.como_recibes_ingresos;
    }
    
    //code 
    
    var comprobantes=[];
    var j=0;
    for(var i=0;i<(event.comprobante).length;i++){
      if(event.comprobante[i].img_comprobante_ingresos && event.comprobante[i].tipo_comprobante){
      
     // var bitmap = new Buffer(event.comprobante[i].img_comprobante_ingresos, 'base64');
      var datos_img = (event.comprobante[i].img_comprobante_ingresos).split(",");
      
      if(datos_img.length>1){
        var bitmap = new Buffer(datos_img[1], 'base64');
        var tipo_imagen =datos_img[0];
    }
    else{var bitmap = new Buffer(datos_img[0], 'base64');
    var tipo_imagen ="nulo";}
      
      fs.writeFileSync("/tmp/comprobante_ingresos.jpg", bitmap);

      var keyurlfile1="prestatario/"+event.username+"/laboral/comprobante-"+j;
      j++;
      mimg_comprobante_ingresos=keyurlfile1;
      var params1 = {
              localFile: "/tmp/comprobante_ingresos.jpg",
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
            mimg_comprobante_ingresos=keyurlfile1;
            console.log(mimg_comprobante_ingresos)
      
    mtipo_comprobante=event.comprobante[i].tipo_comprobante;
    
    var comprobante = {
            "img_comprobante_ingresos": keyurlfile1,
            "tipo_de_imagen": tipo_imagen,
            "tipo_comprobante": mtipo_comprobante
          };
          comprobantes.push(comprobante);
    }
    }
          
          var params = {
                  TableName:"prestatario",
                  Key:{
                  "username": usern,
                  "correo": corr
                      },
                  UpdateExpression: "set ocupacion.ocupacion = :oc," +
                      " laborales.tipo_contratacion=:tc," +
                      " laborales.actividad_profesional = :ap," +
                      " laborales.tiempo_empleo_actual = :te," +
                      " laborales.nivelestudios = :ne," +
                      " laborales.ingreso_mensual_libre = :im," +
                      " laborales.comprobantes = :comprobantes," +
                      " laborales.gastos_mensuales = :gm," +
                      " laborales.tiempo_actividad = :tieac," +
                      " laborales.sector = :sec," +
                      " laborales.como_recibes_ingresos = :recing," +
                      " solicitud.pantalla = :pantalla," +
                      " solicitud.fecha_ultima_actualizacion  = :fecha",
                  ExpressionAttributeValues:{
                      ":oc":event.ocupacion,
                      ":tc":mtipo_contratacion,
                      ":ap":mactividad_profesional,
                      ":te":mtiempo_empleo_actual,
                      ":ne":mnivelestudios,
                      ":im":mingreso_mensual_libre,
                      ":comprobantes":comprobantes,
                      ":gm":mgastos_mensuales,
                      ":tieac":mtiempo_actividad,
                      ":sec":msector,
                      ":recing":mcomo_recibes_ingresos,
                      ":pantalla":pantalla,
                      ":fecha":fecha_mod
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
                  
                   // var filem = [];
                   
                      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                      
                   if(event.ocupacion=="otro"){
                      return cb(null, {
                        "err":0,
                        "message":"identificacion guardada",
                         "p_data":{
                           "ocupacion":event.ocupacion,
                           "nivelestudios":mnivelestudios,
                           "ingreso_mensual_libre":mingreso_mensual_libre,
                           "comprobante":comprobantes,
                           "como_recibes_ingresos":mcomo_recibes_ingresos
                         }
                      });
                      
                  }
                  else if(event.ocupacion=="empresario"){
                    return cb(null, {
                      "err":0,
                      "message":"identificacion guardada",
                       "p_data":{
                         "ocupacion":event.ocupacion,
                         "actividad_profesional":mactividad_profesional,                 
                         "nivelestudios":mnivelestudios,
                         "ingreso_mensual_libre":mingreso_mensual_libre,
                         "comprobante":comprobantes,
                         "gastos_mensuales":mgastos_mensuales,
                         "tiempo_actividad":mtiempo_actividad
                       }
                    });
                    
                }
                  else if(event.ocupacion=="empleado"){
                    return cb(null, {
                      "err":0,
                      "message":"identificacion guardada",
                       "p_data":{
                         "ocupacion":event.ocupacion,
                         "tipo_contratacion":mtipo_contratacion,
                         "actividad_profesional":mactividad_profesional,
                         "tiempo_empleo_actual":mtiempo_empleo_actual,
                         "nivelestudios":mnivelestudios,
                         "ingreso_mensual_libre":mingreso_mensual_libre,
                         "comprobante":comprobantes,
                         "sector":msector
                       }
                    });
                    
                }
                  }
              });
          
    
    
    }
  }
  
  
  
                   }
               });
  }
 
};
