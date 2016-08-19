'use strict';
var oracledb = require('resuelvedb');

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  var bindvars = {
    "C_LISTA": {
      "type": "oracledb.CURSOR",
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
  var p_resultado = {
    "p_data": [],
    "p_data2":{"plazomin":6,"pazomax":36,"intervalo":1},
    "err": "0",
    "message": ""
  };

  var sql = "BEGIN SCH_LATASA.GET_TERM_TABLE(:C_LISTA, :P_ERR_NO, :P_ERR_MSG ); END;";
  oracledb.execute(sql, bindvars, function(err, result) {

    if (err) {
      p_resultado.p_err_msg = err;
      return cb(null, p_resultado);
    }

    if (!result) {
      p_resultado.p_err_msg = "No hay plazos configurados para el cotizador.";
      return cb(null, p_resultado);

    }

    var registros = result.rows;
    if (Object.prototype.toString.call(registros) !== '[object Array]') {
      p_resultado.p_err_msg = "No es posible recuperar los plazos.";
      return cb(null, p_resultado);
    }

    var plazosList = [];
    for ( var indice = 0; indice < registros.length; indice++) {
      var plazos= parseInt(registros[indice])
      var p_item = {
        "plazo": plazos
      };
      plazosList.push(p_item);
    }

    p_resultado.p_data = plazosList;
    return cb(null, p_resultado);

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
    TableName: "cotizador",
    KeyConditions: {
      Status: {
          ComparisonOperator: "EQ", 
          AttributeValueList: [ 
              "OK"
          ]
      }
  },
    ScanIndexForward: true
  };

  var resultado = {
    "p_data": [],
    "err": "0",
    "message": ""
  };

  dynamo
          .scan(
                  params,
                  function(err, data) {
                    if (err) {
                      resultado.err=1;
                      resultado.message = err;
                      return cb(null, resultado);
                    }
                    if(!data){
                      resultado.err=1;
                      resultado.message = "No hay plazos configurados en el cotizador";
                      return cb(null, resultado)
                    }
                    var plazosList = [];
                    data.Items.forEach(function(item){
                      var p_item = {
                              "plazo": item.plazo
                            };
                      plazosList.push(p_item);
                    });
                                

                    resultado.p_data = plazosList;                   
                    return cb(null, resultado);
                  });

};*/