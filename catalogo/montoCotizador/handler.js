'use strict';


var oracledb = require('resuelvedb');

var p_resultado = {
  "p_data": [],
  "p_data_minmax":[],
  "err": "0",
  "message": ""
};

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  var bindvars = {
    "P_MIN_AMOUNT": {
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_OUT"
    },
    "P_MIN_DIVISOR": {
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_OUT"
    },
    "P_MAX_AMOUNT": {
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

  var montosList = [];

  var sql = "BEGIN SCH_LATASA.GET_CREDIT_RANGE_PAR(:P_MIN_AMOUNT, :P_MIN_DIVISOR, :P_MAX_AMOUNT, :P_ERR_NO, :P_ERR_MSG ); END;";
  oracledb
          .execute(
                  sql,
                  bindvars,
                  function(err, result) {
                    var configuracion = result.outBinds;
                    if (err) {
                      p_resultado.message = err;
                      p_resultado.err=1;
                      return cb(null, p_resultado);
                    }

                    else if (!result || !result.outBinds) {
                      p_resultado.message = "No hay montos configurados para el cotizador.";
                      p_resultado.err=1;
                      return cb(null, p_resultado);
                    }

                    
                    else if (isNaN(configuracion.P_MIN_AMOUNT)) {
                      p_resultado.message = "No hay monto minimo";
                      p_resultado.err=1;
                      return cb(null, p_resultado);
                    }

                    else if (isNaN(configuracion.P_MIN_DIVISOR)) {
                      p_resultado.message = "No hay intervalo de montos para el cotizador.";
                      p_resultado.err=1;
                      return cb(null, p_resultado);
                    }

                    else if (isNaN(configuracion.P_MAX_AMOUNT)) {
                      p_resultado.message = "No hay monto maximo.";
                      p_resultado.err=1;
                      return cb(null, p_resultado);
                    }
                      /*
                    var montosList = [];
                    for ( var indice = configuracion.P_MIN_AMOUNT; indice <= configuracion.P_MAX_AMOUNT; indice += configuracion.P_MIN_DIVISOR) {
                      var item = {
                        "monto": indice
                      };
                      montosList.push(item);
                    }

                    p_resultado.p_data = montosList;
                    return cb(null, p_resultado);

                  });*/
                    else{
                    var montosList = [];
                    var count = 0;
                    console.log("monto minimo "+configuracion.P_MIN_AMOUNT);
                    var item = {
                            "monto": configuracion.P_MIN_AMOUNT
                          };

                    montosList.push(item);
                    
                 //   P_MIN_AMOUNT":30000,"P_MIN_DIVISOR":5000,"P_MAX_AMOUNT":350000,
                    var rp=(configuracion.P_MAX_AMOUNT-configuracion.P_MIN_AMOUNT)/configuracion.P_MIN_DIVISOR;
                    console.log("respuesta - "+rp);
                    var mimonto=configuracion.P_MIN_AMOUNT;
                    for(var i=0;i<rp;i++){         
                      mimonto=mimonto+configuracion.P_MIN_DIVISOR;
                      var item = {
                              "monto": mimonto
                            };

                            montosList.push(item);
                    }
                    p_resultado.p_data = montosList;
                    
                    mimonto=mimonto+configuracion.P_MIN_DIVISOR;
                    var item = {
                            "minimo":configuracion.P_MIN_AMOUNT,
                            "maximo":configuracion.P_MAX_AMOUNT,
                            "intervalo":configuracion.P_MIN_DIVISOR
                          };
                    var montosList2 = [];
                    montosList2.push(item);
                    p_resultado.p_data_minmax = montosList2;
//                    p_resultado.p_data.minmax :{minino:configuracion.P_MIN_AMOUNT,
//                                              maximo:configuracion.P_MAX_AMOUNT,
//                                              intervalo:configuracion.P_MIN_DIVISOR}
                    return cb(null, p_resultado);
                    }
                  });
};

/*
var AWS = require('aws-sdk');

var dynamoDBConf = {
  "accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
  "secretAccessKey": "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",
  "region": "us-east-1",
};

AWS.config.update(dynamoDBConf);

var dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = function(event, context, cb) {

  context.callbackWaitsForEmptyEventLoop = false;
  var params = {
    TableName: "monto_cotizador",
    FilterExpression: 'version = :version',
    ExpressionAttributeValues: {
      ':version': 1
    }
  };

  var resultado = {
    "p_data": [],
    "err": "",
    "message": ""
  };

  dynamo.scan(
                  params,
                  function(err, data) {
                    if (err) {
                      console.log("error de cotizador");
                      resultado.p_err_msg = err;
                      return cb(null, resultado);
                    }
                    

                    var configuracion = data.Items[0];
                    console.log(configuracion)
                    
                    if (isNaN(configuracion.monto_minimo)) {
                      resultado.err = "No hay monto minimo especificado dentro del cotizador";
                      return cb(null, resultado);
                    }
                    if (isNaN(configuracion.monto_maximo)) {
                      resultado.message = "No hay monto maximo especificado dentro del cotizador";
                      return cb(null, resultado);
                    }
                    if (isNaN(configuracion.intervalo)) {
                      resultado.message = "No hay intervalo especificado dentro del cotizador";
                      return cb(null, resultado);
                    }
                    
                    var montosList = [];
                    var count = 0;
                    console.log("monto minimo "+configuracion.monto_minimo);
                    var item = {
                            "monto": configuracion.monto_minimo
                          };

                    montosList.push(item);

                    var rp=(configuracion.monto_maximo-configuracion.monto_minimo)/configuracion.intervalo;
                    console.log("respuesta - "+rp);
                    var mimonto=configuracion.monto_minimo;
                    for(var i=0;i<rp;i++){         
                      mimonto=mimonto+configuracion.intervalo;
                      var item = {
                              "monto": mimonto
                            };

                            montosList.push(item);
                    }
                    resultado.p_data = montosList;
                    return cb(null, resultado);
                  });

};
*/
