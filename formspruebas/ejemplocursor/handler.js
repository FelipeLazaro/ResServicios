'use strict';
var oracledb = require('resuelvedb');

module.exports.handler = function(event, context, cb) {
  
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
          "err": "0",
          "message": ""
        };
      //No hay ningun cambio en el query
      var sql = "BEGIN SCH_LATASA.GET_REF_CRED_PURPOSE(:C_LISTA, :P_ERR_NO, :P_ERR_MSG ); END;";


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
          
          var catalogoList = [];
          for ( var indice = 0; indice < (result.rows).length; indice++) {

            var p_item = {
              "id": result.rows[indice][0],
              "nombre": result.rows [indice][1]
            };
            catalogoList.push(p_item);
          }

          p_resultado.p_data = catalogoList;
          return cb(null, p_resultado);
          
          return cb(null, {
            err:0,
            message: result,
            p_data:result.rows
          });
      }
      });

  
  
  
};
