'use strict';
var AWS = require('aws-sdk');
var oracledb = require('resuelvedb');

var dynamoDBConf = {
  "accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
  "secretAccessKey": "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",
  "region": "us-east-1",
}
AWS.config.update(dynamoDBConf);
var dynamo = new AWS.DynamoDB.DocumentClient();

var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

var transporter = nodemailer.createTransport(ses({
   region: "us-west-2",
  accessKeyId: "AKIAJQ5S6J25PWAYFJSA",
  secretAccessKey: "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"
}));


var docClient = new AWS.DynamoDB.DocumentClient();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports.handler = function(event, context, cb) {
  var mcorreo=event.password;
  var use2=false;
  var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!expr.test(mcorreo)) {
    console.log("Error: La direccion de correo " + mcorreo + " es incorrecta.");
    return cb(null, {
      err:1,
      message:"error en el formato de correo electronico"
    });
  }
  
  else{
    var bindvars = {
            "correo": {
              val: mcorreo,
              "type": "oracledb.VARCHAR2",
              "dir": "oracledb.BIND_IN"
            },
            "P_EXISTE": {
              "type": "oracledb.NUMBER",
              "dir": "oracledb.BIND_OUT"
            },
            "P_ERR_NO": {
              "type": "oracledb.NUMBER",
              "dir": "oracledb.BIND_OUT"
            },
            "P_ERR_MSG": {
              "type": "oracledb.VARCHAR2",
              "dir": "oracledb.BIND_OUT"
            }
          };
    
    var sql = "BEGIN SCH_APP.EMAIL_CHECK_S(:correo, :P_EXISTE, :P_ERR_NO, :P_ERR_MSG); END;";
    oracledb.execute(sql, bindvars, function(err, result) {

      if (err) {
        console.log("error" + err)
        return cb(null, {
          err:1,
          message:"error en la base "+err,
        });
      } else {
        console.log("existe oracle : "+result.outBinds.P_EXISTE)
        use2 = result.outBinds.P_EXISTE;
        
        
        var params = {
                TableName: "prestatario",
                FilterExpression: 'correo = :cp',
                ExpressionAttributeValues: {
                  ':cp': mcorreo
                }
              };
        
        dynamo.scan(params,function(err, data) {
                  if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    return cb(null, {
                      err:1,
                      message: 'error en la base'
                    });
                  } 
                  else {
                    if (data.Count > 0) {console.log("correo existente en dynamoDB: "+ data.Count);
                      use2 = true;}
                      console.log(data.Items[0])
                    if(use2==true){
                      console.log("envio de mail")       
                      ////enviar correo
                      
                      
                    transporter.sendMail({
                                            from: 'info@latasa.mx',
                                            to: '"Cliente la tasa" <'+mcorreo+'>', 
                                            subject: 'recupera tu password',
                                            text: 'Bienvenido! ingresa al siguiente link para comprobar tu correo : ',                                                                                                                    
                                            html:'<!doctype html><html><head><meta charset="UTF-8"><title>LA TASA</title></head>'+
                                            '<head><body style="margin:0; padding:0;"><table border="0" cellpadding="0" cellspacing="0" width="100%">'+
                                            '<tr><td><table align="center" border="0" cellpadding="0" cellspacing="0" style="border: 1px solid #ccc;" width="600">'+
                                            '<tr><td><table align="center" bgcolor="ffffff" border="0" cellpadding="0" cellspacing="0" width="600" height="80px" style="border-collapse: collapse;">'+
                                            '<tr><td align="center"><img src="cid:resuelve@logo.com" width="90" height="70" alt="resuelve tu deuda">'+
                                            '</td></tr></table></td></tr><tr><td>'+
                                            '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" height="220">'+
                                            '<tr><td bgcolor="#00A0DF" align="center" ><img src="cid:resuelve@mono.com" width="209" height="204" alt="resuelve tu deuda" style="display:block; margin-top: 20px;">'+
                                            '</td></tr></table></td></tr><tr><td>'+
                                            '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" height="270">'+
                                            '<tr><td bgcolor="#ffffff" style="padding:10px 0 20px 0; font-family: sans-serif; font-size:18px; color:#ffff; text-align: center; padding:20px;">'+
                                            '<span style="font-family: sans-serif; color:#00538A; font-weight: bold;"> &iexcl;Hola '+data.Items[0].perfil.nombres+'</span><span style="color:#00A0DF;"></span><span style="font-family: sans-serif; color:#00538A; font-weight: bold; ">!</span>'+
                                            '</td></tr><tr><td align="center" bgcolor="#ffffff" style="padding: 20px 0 30px 0;">'+
                                            '<br><span style="color:#959595; font-family: sans-serif; font-size:16px; padding:10px;">tu password es : '+data.Items[0].password+'.'+
                                            '<br><br><br>'+
                                            '<span style="color:#00A0DF; font-size:16px;"> </span>'+
                                            '</td></tr><tr>'+
                                            '<td align="center" bgcolor="#ffffff" style="padding: 10px 0 20px 0;"><a href="https://www.latasa.mx/?utm_source=sitio_resuelve&utm_medium=categoria_latasa&utm_content=nuestras_marcas%20&utm_campaign=nuestras_marcas_latasa" target="_blank">'+
                                            '<img src="cid:resuelve@btn.com" alt="La Tasa"></td></tr>'+
                                            '<tr><td align="center" bgcolor="#f8f8f8" style="padding: 10px 0 10px 0;"><br>'+
                                            '<span style="color:#959595; font-family: sans-serif; font-size:10px; padding:5px;"> &copy; 2015 La tasa | Paseo de la Reforma 39-2 Col. Tabacalera, Delegaci&oacute;n Cuauht&eacute;moc CDMx C. P. 06030</span>'+
                                            '</td></tr></td></tr></table>'+
                                            '</td></tr></table></body></html></html>',
                                                                                                                                                
                                            attachments: [
                                                  {
                                                    filename: 'resuelve.png',
                                                    path: __dirname + '/assets/logo.png',
                                                    cid: 'resuelve@logo.com'
                                                    },
                                                  {
                                                    filename: 'resuelve2.png',
                                                    path: __dirname + '/assets/mono.png',
                                                    cid: 'resuelve@mono.com'
                                                  },
                                                  {
                                                    filename: 'resuelve3.png',
                                                    path: __dirname + '/assets/btn.jpg',
                                                    cid: 'resuelve@btn.com'
                                                  },]},function(err, data) {
                                                          if(err) {console.log("error n "+err );
                                                          return cb(null,{
                                                                err:1,
                                                                message:"error al enviar correo intentelo nuevamente - "
                                                               });
                                                           }
                                                          else{   console.log('Email sent:');
                                                          return cb(null, {
                                                            err:0,
                                                            message: 'envio de mail!'
                                                          });
                                                          }          
                                                  });
                                                  
                  
                      
                      ///enviar correo                  
                      return cb(null, {
                        err:0,
                        message: 'envio de mail!',
                      });
                    }
                    else{console.log("correo inexistente")
                    return cb(null, {
                      err:1,
                      message: 'correo inexistente'
                    });
                    }
                  }//end else
          });//end dynamo
       }//end else
    });//end oracle
  }//end else
};//end function
