'use strict';

var AWS = require('aws-sdk');
var AWS2 = require('aws-sdk');
var oracledb = require('resuelvedb');
var suid = require('rand-token').suid;

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
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(event)

 var mcorreo = event.prestatario_alta.perfil.correo;
  var mnick = event.prestatario_alta.perfil.username;
  var mmonto = event.prestatario_alta.cotizador.monto;
  var mplazo = event.prestatario_alta.cotizador.plazo;
  var maplica = event.prestatario_alta.cotizador.aplica;
  var mtaza_min = event.prestatario_alta.cotizador.tasa_min;
  var mtaza_max = event.prestatario_alta.cotizador.tasa_max;
  var mfactor_min_pago = event.prestatario_alta.cotizador.factor_min_pago;
  var mfactor_max_pago = event.prestatario_alta.cotizador.factor_max_pago;
  var mpago_mensual_min = event.prestatario_alta.cotizador.pago_mensual_min;
  var mpago_mensual_max = event.prestatario_alta.cotizador.pago_mensual_max;
  var mdeuda_anterior = parseInt(event.prestatario_alta.cotizador.deuda_anterior);

  if (mdeuda_anterior == 1) {
    var mmonto_deuda = parseInt(event.prestatario_alta.cotizador.monto_deuda);
    var mpago_mensual = parseInt(event.prestatario_alta.cotizador.pago_mensual);
    var maplicado_en = event.prestatario_alta.cotizador.aplicado_en;
    if(event.prestatario_alta.cotizador.aplicado_en!="otro"){var maplicado_otro="nulo"}
    else {var maplicado_otro= event.prestatario_alta.cotizador.aplicado_otro;}
  } else {
    var mmonto_deuda = 0;
    var mpago_mensual = 0
    var maplicado_en = null;
    var maplicado_otro=null;
  }

  var mnombres = event.prestatario_alta.perfil.nombres;
  var mapaterno = event.prestatario_alta.perfil.apaterno;
  var mamaterno = event.prestatario_alta.perfil.amaterno;
  var mpassword = event.prestatario_alta.perfil.password;
  
  var correoaenviar=event.prestatario_alta.perfil.correo;
  var fecha_mod = new Date().toISOString().replace(/T/, ' ')
          .replace(/\..+/, '');

  var params2 = {
    TableName: "prestatario",
    Item: {
      "correo": mcorreo,
      "username": mnick,
      "password": mpassword,
      "cotizador": {
        "monto_solicitado": parseInt(mmonto),
        "plazo_solicitado": parseInt(mplazo),
        "aplicar_en": maplica,
        "tasa_min": mtaza_min,
        "tasa_max": mtaza_max,
        "factor_min_pago": mfactor_min_pago,
        "factor_max_pago": mfactor_max_pago,
        "pago_mensual_min": mpago_mensual_min,
        "pago_mensual_max": mpago_mensual_max,
        "tiene_deuda_anterior": mdeuda_anterior,
        "deuda_anterior": {
          "monto_deuda": parseInt(mmonto_deuda),
          "pago_mensual": parseInt(mpago_mensual),
          "aplicado_en": maplicado_en,
          "aplicado_otro": maplicado_otro
        }
      },
      "perfil": {
        "nombres": mnombres,
        "apaterno": mapaterno,
        "amaterno": mamaterno
      },
      "solicitud": {
        "estatus_confirma_correo":0,
        "estatus": "temporal",
        "pantalla": 2,
        "fecha_ultima_actualizacion": fecha_mod
      },
      "identificacion":{},
      "domicilio":{},
      "personales":{},
      "ocupacion":{},
      "laborales":{}
    }
  };



  var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!expr.test(mcorreo)) {
    console.log("Error: La direccion de correo " + mcorreo + " es incorrecta.");
    return cb(null, {
      err:1,
      message:"error en el formato de correo electronico",
      p_data: {
        setparams: params2
      }
    });
  } 
  
  
  else {

    if (mcorreo.length > 0 && mnick.length > 0 && maplica.length > 0
            && mtaza_min.length > 0 && mtaza_max.length > 0
            && mfactor_min_pago.length > 0 && mfactor_max_pago.length > 0
            && mnombres.length > 0 && mapaterno.length > 0
            && mamaterno.length > 0 && mpassword.length > 0) {

      var use = false;
      var use2 = false;
///////////inicio dynamo scan correo
      console.log("valor de correo para oracle : "+mcorreo)
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
                  p_data: {
                    setparams: params2
                  }
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
       
      
      dynamo
              .scan(
                      params,
                      function(err, data) {
                        if (err) {
                          console.error("Unable to read item. Error JSON:",
                                  JSON.stringify(err, null, 2));
                        } else {

                          if (data.Count > '0') {
                            console.log("correo existente en dynamoDB: "
                                    + data.Count)
                            use2 = true;
                          }

                          if (use2 == true) {

                            return cb(
                                    null,
                                    {
                                      err:1,
                                      message:"error al guardar, correo ya esta en uso",
                                      p_data: {
                                        setparams: params2
                                      }
                                    });
                          } else {

                            
                            
      ///////////////////////inicio dynamo scan
                            var bindvars = {
                                    "P_USERNAME": {
                                      val: mnick,
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

                                  var sql = "BEGIN SCH_APP.USERNAME_CHECK_S(:P_USERNAME, :P_EXISTE, :P_ERR_NO, :P_ERR_MSG); END;";
                                  oracledb.execute(sql, bindvars, function(err, result) {

                                    if (err) {
                                      console.log("error" + err)
                                      return cb(null, {
                                        err:1,
                                        message:"error en la base - "+err,
                                        p_data: {
                                          setparams: params2
                                        }
                                      });
                                    } else {
                                      use = result.outBinds.P_EXISTE;
                                      console.log("usuario existente en oracle "+use)
                            
                            var params3 = {
                              TableName: "prestatario",
                              FilterExpression: 'username = :un',
                              ExpressionAttributeValues: {
                                ':un': mnick
                              }
                            };

                      
                            dynamo
                                    .scan(
                                            params3,
                                            function(err, data) {
                                              if (err) {
                                                console
                                                        .error(
                                                                "Unable to read item. Error JSON:",
                                                                JSON
                                                                        .stringify(
                                                                                err,
                                                                                null,
                                                                                2));
                                              } else {

                                                if (data.Count > '0') {
                                                  console
                                                          .log("usuario existente en dynamoDB: "
                                                                  + data.Count)
                                                  use = true;
                                                }

                                                if (use == true) {
                                                  return cb(
                                                          null,
                                                          {
                                                            err:1,
                                                            message: 'error al guardar, nick de usuario en uso',
                                                            p_data: {
                                                              setparams: params2
                                                            }
                                                          });
                                                }

                                                else {
                                                  console
                                                          .log("guardando datos en la base de datos dynamo")

                                                  dynamo
                                                          .put(
                                                                  params2,
                                                                  function(err,
                                                                          data) {
                                                                    if (err) {
                                                                      console
                                                                              .log(JSON
                                                                                      .stringify(
                                                                                              err,
                                                                                              null,
                                                                                              2));
                                                                      return cb(
                                                                              null,
                                                                              {
                                                                                err:1,
                                                                                message: 'error al guardar en base de datos : '+ err,
                                                                                p_data: {
                                                                                  setparams: params2
                                                                                }
                                                                              });
                                                                    }

                                                                    else {
                                                                          
                                                                      
                                                                      /*
                                                                      var token = suid(16);
                                                                      var params = {
                                                                          TableName: "correo_resuelve_verifica",
                                                                          Item: {
                                                                            new_token:token,      
                                                                            username:mnick,
                                                                            estatus:0
                                                                            }
                                                                          };

                                                                      
                                                                     //  console.log("http://localhost:1465/correodeverificacion/"+token)

                                                                      docClient.put(params, function(err, data) {
                                                                          if (err)
                                                                              console.log("error al guardar datos de correo "+JSON.stringify(err, null, 2));
                                                                          else
                                                                              console.log("guardado en datos de correo"+JSON.stringify(data, null, 2));
                                                                      });//end doClient para guardar info en dynamo
                                                                      
                                                                      var linkdeverificacion="https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/correodeverificacion/"+token;
                                                                     
                                                                      
                                                                        var message = {
                                                                            to: '"Cliente la tasa" <'+mcorreo+'>',
                                                                            subject: 'confirma email', //
                                                                            text: 'Bienvenido! ingresa al siguiente link para comprobar tu correo : '+linkdeverificacion,
                                                                            
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
                                                                            '<br><span style="font-family: sans-serif; color:#00538A; font-weight: bold;"> &iexcl;Hola</span><span style="color:#00A0DF;"> '+mnombres +' '+ mapaterno+'</span>, <span style="font-family: sans-serif; color:#00538A; font-weight: bold; ">ya eres parte de la Tasa!</span>'+
                                                                            '</td></tr><tr><td align="center" bgcolor="#ffffff" style="padding: 20px 0 30px 0;">'+
                                                                            '<br><span style="color:#959595; font-family: sans-serif; font-size:16px; padding:10px;">Valida tu cuenta para continuar con tu solicitud y comienza a disfrutar'+
                                                                            '<br>los pr&eacute;stamos con las mejores tasas de inter&eacute;s.<br><br>'+
                                                                            '<span style="color:#00A0DF; font-size:16px;"> &iexcl;Entra y disfruta tu tasa especial!</span>'+
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
                                                                              },
                                                                                
                                                                            ]
                                                                        };//end message

                                                                        transporter.sendMail(message, function (error, info) {
                                                                            if (error) {
                                                                              return cb(
                                                                                      null,
                                                                                      {
                                                                                        err:0,
                                                                                        message:"error al enviar correo intentelo nuevamente - "+error,
                                                                                        p_data: {
                                                                                          setparams: params2
                                                                                        }
                                                                                      });
                                                                            }
                                                                            else{
                                                                              console.log("correo enviado")
                                                                              return cb(
                                                                                      null,
                                                                                      {
                                                                                        err:0,
                                                                                        message:"datos guardador exitosamente",
                                                                                        p_data: {
                                                                                          setparams: params2
                                                                                        }
                                                                                      });
                                                                            }
                                                                        });//end transport
                                                                        
                                                                        
                                                                                               */         
                                                                      
                                                                      transporter.sendMail({
                                                                        from: 'info@latasa.mx',
                                                                        to: '"Cliente la tasa" <'+mcorreo+'>', 

                                                                        subject: 'confirma tu correo',
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
                                                                       '<br><span style="font-family: sans-serif; color:#00538A; font-weight: bold;"> &iexcl;Hola</span><span style="color:#00A0DF;"> '+mnombres +' '+ mapaterno+'</span>, <span style="font-family: sans-serif; color:#00538A; font-weight: bold; ">ya eres parte de la Tasa!</span>'+
                                                                       '</td></tr><tr><td align="center" bgcolor="#ffffff" style="padding: 20px 0 30px 0;">'+
                                                                       '<br><span style="color:#959595; font-family: sans-serif; font-size:16px; padding:10px;">Valida tu cuenta para continuar con tu solicitud y comienza a disfrutar'+
                                                                       '<br>los pr&eacute;stamos con las mejores tasas de inter&eacute;s.<br><br>'+
                                                                       '<span style="color:#00A0DF; font-size:16px;"> &iexcl;Entra y disfruta tu tasa especial!</span>'+
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
                                                                                                                                                  },
                                                                                                                                                    
                                                                                                                                                ]
                                                                      },function(err, data) {
                                                                        if(err) {console.log("error n "+err );
                                                                        return cb(
                                                                                null,
                                                                                {
                                                                                  err:0,
                                                                                  message:"error al enviar correo intentelo nuevamente - "+error,
                                                                                  p_data: {
                                                                                    setparams: params2
                                                                                  }
                                                                                });
                                                                        }
                                                                         else{   console.log('Email sent:');
                                                                            console.log(data);
                                                                            return cb(
                                                                                    null,
                                                                                    {
                                                                                      err:0,
                                                                                      message:"datos guardador exitosamente",
                                                                                      p_data: {
                                                                                        setparams: params2
                                                                                      }
                                                                                    });   
                                                                         }
                                                                     });

    
                                                                      
                                                                      
                                                                    }   //////end else

                                                                  });

                                                }
                                              }
                                            });
                            
                            //////////////////////////////fin dynamo scan nombre
                                    }
                                  });
                          }

                        }
                      });

      
              }
            });
      console.log("datos recibidos correctamente")
    } else {
      console.log("error - faltan datos por llenar")
      return cb(null, {
        err:1,
        message: 'error - faltan datos por llenar :',
        p_data: {
          setparams: params2
        }
      });
    }
  }// antes de aca
};
