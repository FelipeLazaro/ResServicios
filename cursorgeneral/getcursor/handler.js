'use strict';
var oracledb = require('resuelvedb');

module.exports.handler = function(event, context, cb) {
  
  var bindvars = {
          "VL": {
            "type": "oracledb.NUMBER",
            "dir": "oracledb.BIND_IN",
            val:1
        },
          "RFC": {
            "type": "oracledb.VARCHAR2",
            "dir": "oracledb.BIND_IN",
            val:event.variable
        },
          "C_LISTA": {
              "type": "oracledb.CURSOR",
              "dir": "oracledb.BIND_OUT"
          },
          "ERR_NO": {
              "type": "oracledb.NUMBER",
              "dir": "oracledb.BIND_OUT"
          },
          "ERR_MSG": {
              "type": "oracledb.VARCHAR2",
              "dir": "oracledb.BIND_OUT"
          }
      };

      //No hay ningun cambio en el query
      var sql = "BEGIN MDM.GET_CURSOR(:VL, :RFC, :C_LISTA, :ERR_NO, :ERR_MSG ); END;";


      //La llamada es directa, no se necesita conectarse a la base, solo ejecutar la sentencia o store

      oracledb.execute(sql, bindvars, function (err, result) {

          if (err) {
              console.log("Error: " + err);
              return cb(null, {
                err:1,
                message: err,
                p_data:"{}"
              });
          }
          else{
          console.log(result);
          return cb(null, {
            err:0,
            message: result,
            p_data:result.rows
          });
      }
      });

  
  
  
};
