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
  console.log("iniciando oracledb")
  var bindvars = {
    "P_USERNAME": {
      val: event.username,
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
        message:err,
        p_data: {
        }
      });
    } else {
      existente = result.outBinds.P_EXISTE;

      var params = {
        TableName: "prestatario",
        FilterExpression: 'username = :un',
        ExpressionAttributeValues: {
          ':un': event.username
        }
      };

      dynamo.scan(params, function(err, data) {

        if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err,
                  null, 2));
          return cb(null, {
            err:1,
            message:"error al leer en la base de datos "+err,
            p_data: {
              "existe": existente,
            }
          });
          
        } else {
          if (parseInt(data.Count) > 0) {

            existente = 1;
          }
          return cb(null, {
            err:0,
            message:"",
            p_data: {
              "existe": existente,
            }
          });
        }

        
      });

    }

  });

};
