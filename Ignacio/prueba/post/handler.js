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

var docClient = new AWS.DynamoDB.DocumentClient();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(event);


  var JSONinput = (event != null)?event:null;

  
  if(JSONinput != null && JSONinput.hasOwnProperty('username') && JSONinput.hasOwnProperty('token') && JSONinput.prestatario_alta.hasOwnProperty('cotizador') && JSONinput.prestatario_alta.hasOwnProperty('perfil')) {
    
    var datosPermitidosNull = ["token","monto_deuda","pago_mensual","aplicado_en","aplicado_otro"];

    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if(!expr.test(JSONinput.prestatario_alta.perfil.correo)) {
      
      responseData(1,"error en el formato de correo electronico",JSONinput);

    }if(jsonEmpty(JSONinput,datosPermitidosNull)){

      var fecha_mod = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

      JSONinput.prestatario_alta.cotizador.deuda_anterior = parseInt(JSONinput.prestatario_alta.cotizador.deuda_anterior);
      JSONinput.prestatario_alta.cotizador.monto_deuda = (JSONinput.prestatario_alta.cotizador.deuda_anterior == 1)?parseInt(JSONinput.prestatario_alta.cotizador.monto_deuda):0;
      JSONinput.prestatario_alta.cotizador.pago_mensual = (JSONinput.prestatario_alta.cotizador.deuda_anterior == 1)?parseInt(JSONinput.prestatario_alta.cotizador.pago_mensual):0;
      JSONinput.prestatario_alta.cotizador.aplicado_en = (JSONinput.prestatario_alta.cotizador.deuda_anterior == 1)?JSONinput.prestatario_alta.cotizador.aplicado_en:'null';
      JSONinput.prestatario_alta.cotizador.aplicado_otro = (JSONinput.prestatario_alta.cotizador.deuda_anterior == 1 && JSONinput.prestatario_alta.cotizador.aplicado_en == "otro")?JSONinput.prestatario_alta.cotizador.aplicado_otro:'null';

      var JSONdynamo = {
          TableName: "prestatario",
          Item: {
            "correo": JSONinput.prestatario_alta.perfil.correo,
            "username": JSONinput.username,
            "password": JSONinput.prestatario_alta.perfil.password,
            "cotizador": {
              "monto_solicitado": parseInt(JSONinput.prestatario_alta.cotizador.monto),
              "plazo_solicitado": parseInt(JSONinput.prestatario_alta.cotizador.plazo),
              "aplicar_en": JSONinput.prestatario_alta.cotizador.aplica,
              "tasa_min": JSONinput.prestatario_alta.cotizador.tasa_min,
              "tasa_max": JSONinput.prestatario_alta.cotizador.tasa_max,
              "factor_min_pago": JSONinput.prestatario_alta.cotizador.factor_min_pago,
              "factor_max_pago": JSONinput.prestatario_alta.cotizador.factor_max_pago,
              "pago_mensual_min": JSONinput.prestatario_alta.cotizador.pago_mensual_min,
              "pago_mensual_max": JSONinput.prestatario_alta.cotizador.pago_mensual_max,
              "tiene_deuda_anterior": JSONinput.prestatario_alta.cotizador.deuda_anterior,
              "deuda_anterior": {
                "monto_deuda": JSONinput.prestatario_alta.cotizador.monto_deuda,
                "pago_mensual": JSONinput.prestatario_alta.cotizador.pago_mensual,
                "aplicado_en": JSONinput.prestatario_alta.cotizador.aplicado_en,
                "aplicado_otro": JSONinput.prestatario_alta.cotizador.aplicado_otro
              }
            },
            "perfil": {
              "nombres": JSONinput.prestatario_alta.perfil.nombres,
              "apaterno": JSONinput.prestatario_alta.perfil.apaterno,
              "amaterno": JSONinput.prestatario_alta.perfil.amaterno,
              "correo": JSONinput.prestatario_alta.perfil.correo,
              "username": JSONinput.username
            },
            "solicitud": {
              "estatus_confirma_correo":0,
              "estatus": "temporal",
              "pantalla": 2,

              "fecha_ultima_actualizacion": fecha_mod
            },
            "identificacion":{},
            "domicilio":{},
            "laboral":{}
          }
      };

      startValidations();

    }else{
      responseData(1,'error - faltan datos por llenar',JSONinput);
    }//Termino else if length
  }else{
    responseData(1,"error en JSONinput",JSONinput);
  }      

  function startValidations(){
    validaMailOracle();
  }

  function validaMailOracle() {
    var jsonOracleMail = {
        "correo": {
          val: JSONinput.prestatario_alta.perfil.correo,
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
    oracledb.execute(sql, jsonOracleMail, function(err, result) {
      if(err) {
        responseData(1,"error en la base "+err,JSONinput);
      }else {
        console.log("existe oracle : "+result.outBinds.P_EXISTE)
        if(Boolean(result.outBinds.P_EXISTE)){
          responseData(1,"Error el email esta en uso O",JSONinput);
        }else{
          validaMailDinamo();
        }
      }
    });
  }

  function validaMailDinamo() {
    var jsonDynamoMail = {
          TableName: "prestatario",
          FilterExpression: 'correo = :cp',
          ExpressionAttributeValues: {
            ':cp': JSONinput.prestatario_alta.perfil.correo
          }
        };
         
        
    dynamo.scan(jsonDynamoMail,function(err, data) {
        if (err) {
          responseData(1,"error en Dinamo "+err,JSONinput);
        } else {
          if(data.Count > '0') {
            responseData(1,"Error el mail esta en uso D",JSONinput);
          }else{
            validaNickNameOracle();
          }
        }
    });
  }
    

  function validaNickNameOracle() {
    var jsonOracleName = {
        "P_USERNAME": {
          val: JSONinput.username,
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
    oracledb.execute(sql, jsonOracleName, function(err, result) {
        if (err) {
          responseData(1,"error en la base "+err,JSONinput);
        } else {
          console.log("usuario existente en oracle "+result.outBinds.P_EXISTE)
          if(Boolean(result.outBinds.P_EXISTE)){
            responseData(1,"El Usuario ya existe O",JSONinput);
          }else{
            validaNicknameDinamo();
          }
        }  
      });
  }  

  function validaNicknameDinamo(){
    var jsonDynamoName = {
          TableName: "prestatario",
          FilterExpression: 'username = :un',
          ExpressionAttributeValues: {
            ':un': JSONinput.username
          }
        };

    dynamo.scan(jsonDynamoName,function(err, data) {
        if(err) {
          responseData(1,"error en Dinamo "+err,JSONinput);
        }else {
          if(data.Count > '0') {
            responseData(1,"El Usuario ya existe D",JSONinput);
          }else{
            guardaDatosDinamo(JSONdynamo);
          }
        }  
    });    
  }  

  function guardaDatosDinamo(JSONprestatario){
    dynamo.put(JSONprestatario,function(err,data) {
      delete JSONprestatario.Item.password;
      if (err) {
        responseData(1,'error al guardar en base de datos : '+ err,JSONprestatario.Item);
      }else{
        responseData(0,'datos guardador exitosamente',JSONprestatario.Item);
      }
    });
  }

  function jsonEmpty(data,datosPermitidosNull){
    var valorProperty;
    var respuesta = true;
    for(var property in data){
      if(Object.prototype.hasOwnProperty.call(data,property)){
        valorProperty = data[property];
        if(valorProperty === "null" || valorProperty === null || valorProperty === "" || typeof valorProperty === "undefined"){
          if(datosPermitidosNull.indexOf(property) < 0){
            respuesta =  false;
          }      
        }else{
          if(typeof valorProperty === 'object'){
            respuesta = jsonEmpty(valorProperty,datosPermitidosNull);
          }
        }
      }
      if(!respuesta){
        break;
      }
    }
    return respuesta;
  }

  function responseData(error,mensaje,JSONinput){
    return cb(null,{
          err: error,
          message: mensaje,
          p_data: {
            setparams: JSONinput
          }
        });     
  }
  
};