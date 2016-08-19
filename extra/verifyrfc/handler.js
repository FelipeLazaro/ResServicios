'use strict';
var oracledb = require('resuelvedb');
module.exports.handler = function(event, context, cb) {
  
  var bindvars = {
            "P_RFC": {
            val: event.rfc,
            "type": "oracledb.VARCHAR2",
            "dir": "oracledb.BIND_IN"
          },
          "P_NAME": {
            "type": "oracledb.VARCHAR2",
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

        var sql = "BEGIN MDM.GET_NAME_FROM_RFC(:P_RFC, :P_NAME, :P_ERR_NO, :P_ERR_MSG); END;";
        oracledb.execute(sql, bindvars, function(err, result) {
             if (err) { console.error(err.message);   return cb(null, {
               message: 'error en la base de datos -'+err 
             });}
           
             else  {
               if(result.outBinds.P_NAME){  
                 return cb(null, {
                 nombre: result.outBinds.P_NAME
                   });}
               else{
                 return cb(null, {
                   message:'no hay datos para este rfc',
                   nombre: 'inexistente'
                     });
                 
               }
               }
         });
  
};
