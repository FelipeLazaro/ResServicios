'use strict';

var AWS = require('aws-sdk');
var dynamoDBConf = {
  "accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
  "secretAccessKey": "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",
  "region": "us-east-1",
}
AWS.config.update(dynamoDBConf);
var dynamo = new AWS.DynamoDB.DocumentClient();
var oracledb = require('resuelvedb');

module.exports.handler = function(event, context, cb) {
  var existente = 0;
  context.callbackWaitsForEmptyEventLoop = false;
  
  console.log(event.correo)
  
  
  
  var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if ( !expr.test(event.correo) ){ console.log("error en el formato")
    return cb(null, {
      err:1,
      "message":"error en el formato de correo",
      p_data:{
      }
    });}
    
  else{
  
  console.log("iniciando oracledb")
  var bindvars = {
    "correo": {
      val: event.correo,
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
        message:"error en la base - "+err,
        p_data: {
        }
      });
    } else {
      console.log("existe oracle : "+result.outBinds.P_EXISTE)
      existente = result.outBinds.P_EXISTE;

      var params = {
              TableName: "prestatario",
              FilterExpression : 'correo = :cp',
              ExpressionAttributeValues : {':cp' : event.correo}
          };

      dynamo.scan(params, function(err, data) {

        if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err,
                  null, 2));
        } else {
          if (parseInt(data.Count) > 0) {

            existente = 1;
          }
        }

        return cb(null, {
          err:0,
          message:"",      
          p_data: {
            "existe": existente,
          }
        });
      });

    }

  });
  }
};
