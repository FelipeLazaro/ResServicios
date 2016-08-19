'use strict';
var oracledb = require('resuelvedb');


module.exports.handler = function(event, context, cb) {
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
                   oracledb.execute(sql, bindvars, function (err, result){

                                      if (err) {
                                        console.log("error"+err)
                                        return cb(null, {
                                          "Error en la petición : ": err
                                        });
                                      }

                                      console.log("Result: " + result.outBinds);
                                      console.log("llegue aca");
                                      
                                      return cb(null, {
                                        "existe": result.outBinds//result.outBinds
                                      });
                                   

                                    });
                    
             
      
};
