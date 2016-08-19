'use strict';
var oracledb =require("resuelvedb");

module.exports.handler = function(event, context, cb) {
  
 
  context.callbackWaitsForEmptyEventLoop = false;

  console.log("iniciando...")
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

  var sql = "BEGIN MDM.GET_REF_STATES_ISO(:C_LISTA, :P_ERR_NO, :P_ERR_MSG ); END;";
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
      console.log((result.rows).length)
      console.log(result.rows[0][2])
          var lista = [];
      for(var i=0;i<(result.rows).length;i++){
        
        var p_item = {
                "estado": result.rows[i][3],
                "id_estado": result.rows[i][0]
              };
        lista.push(p_item);
      }
      return cb(null, {
        err:0,
        message:"",
        p_data:lista
      });
    }
  });
};