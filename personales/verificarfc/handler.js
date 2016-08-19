'use strict';
var oracledb = require('resuelvedb');
var AWS = require('aws-sdk');
var dynamoDBConf = {
  "accessKeyId": "AKIAJDV4BWUE6BTCCNQA",
  "secretAccessKey": "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",
  "region": "us-east-1",
}
AWS.config.update(dynamoDBConf);
var dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  if(!event.rfc){
    return cb(null, {
      err:1,
      message:"mande rfc a buscar" + event.rfc
    });
  }
  else{
    console.log(event.rfc)
    var bindvars = {
    "RFC": {
      val:event.rfc,
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

  var sql = "BEGIN MDM.RFC_CHECK_S(:RFC, :P_EXISTE, :P_ERR_NO, :P_ERR_MSG ); END;";
  oracledb.execute(sql, bindvars, function(err, result) {

    if (err) {
      return cb(null, {
        err:1,
        message:"error -"+err
      });
    }

    else if (!result) {
      return cb(null, {
        err:1,
        message:"error -no hay datos en la base"
      });

    }

  else{

      var existente = result.outBinds.P_EXISTE;

      var params = {
        TableName: "prestatario",
        FilterExpression: 'identificacion.rfc_homoclave = :un',
        ExpressionAttributeValues: {
          ':un': event.rfc
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
          var userNameDynamo="";
           for (var key in data.Items) {            
            if (data.Items.hasOwnProperty(key)) {
              if(data.Items[key].username){
                userNameDynamo=  data.Items[key].username ;        
              }
            }
          }

          if (parseInt(data.Count) > 0 && userNameDynamo==event.username) {
            /**
             * Valida si el rfc pertenece al mismo usuario entonces es permitido
             */
            existente = 0;
          }else if(parseInt(data.Count)>0){
            /**
             * Valida si se localizo pero no pertence al mismo usuario entonces no es permitido
             */
            existente=1;
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
  }
};