'use strict';
var oracledb = require('resuelvedb');

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var bindvars = {

         "P_TIPO_PLAZO": {
             val:3,
             "type": "oracledb.NUMBER",
             "dir": "oracledb.BIND_IN"
              },
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

      //No hay ningun cambio en el query
      var sql = "BEGIN SCH_LATASA.GET_AMOUNT_BY_TERM_C(:P_TIPO_PLAZO,:C_LISTA, :P_ERR_NO, :P_ERR_MSG ); END;";


      //La llamada es directa, no se necesita conectarse a la base, solo ejecutar la sentencia o store

      oracledb.execute(sql, bindvars, function (err, result) {

          if (err) {
              console.log("Error: " + err);
              return cb(null, {
                err:1,
                message: err,
                p_data:{}
              });
          }
          else{
          console.log(result.rows);
          var datos=[];
          var j=6;
          for(var i=0;i<(result.rows).length;i++){
            var p_item = {
                    "plazo": j,
                    "tasa_min":result.rows[i][0],
                    "tasa_max":result.rows[i][1],
                    "factor_min":result.rows[i][2],
                    "factor_max":result.rows[i][3]
                  };
            datos.push(p_item);
            j++;
            
          }
          return cb(null, {
            err:0,
            message: "",
            p_data:datos
          });
      }
      });

  
  
  
};