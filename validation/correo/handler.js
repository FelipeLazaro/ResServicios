'use strict';
var oracledb = require('oracledb');

var connAttrs = {
  "user": "LATASAUSER",
  "password": "latasauser",
  "connectString": "oraresuelve.crni50oagkmt.us-east-1.rds.amazonaws.com:1521/ORCL"
};

module.exports.handler = function(event, context, cb) {
  oracledb
          .getConnection(
                  connAttrs,
                  function(err, connection) {
                    if (err) {
                      console.error(err.message);
                      return;
                    }

                    var bindvars = {
                      P_CORREO: {
                        val: event.CORREO,
                        type: oracledb.VARCHAR2,
                        dir: oracledb.BIND_IN
                      },
                      P_EXISTE: {
                        type: oracledb.NUMBER,
                        dir: oracledb.BIND_OUT
                      },
                      P_ERR_NO: {
                        type: oracledb.NUMBER,
                        dir: oracledb.BIND_OUT
                      },
                      P_ERR_MSG: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                      }
                    };
                    connection
                            .execute(
                                    "BEGIN MDM.EMAIL_CHECK_S(:P_CORREO,:P_EXISTE,:P_ERR_NO,:P_ERR_MSG); END; ",
                                    bindvars,
                                    function(err, result) {

                                      console.log(bindvars.P_CORREO);
                                      if (err) {
                                        doRelease(connection);
                                        return cb(null, {
                                          "Error en la petición": err
                                        });
                                      }

                                      if (result.outBinds.P_ERR_NO) {
                                        console
                                                .error(result.outBinds.P_ERR_MSG);
                                        doRelease(connection);
                                        return cb(null, {
                                          message: result.outBinds.P_ERR_MSG
                                        });
                                      }
                                      doRelease(connection);

                                      if (parseInt(result.outBinds.P_EXISTE) == 1) { return cb(
                                              null, {
                                                "valor": true
                                              }); }
                                      return cb(null, {
                                        "valor": false
                                      });

                                    });

                  });
  function doRelease(connection) {
    connection.release(function(err) {
      if (err) {
        console.error(err.message);
      }
    });
  }

};
