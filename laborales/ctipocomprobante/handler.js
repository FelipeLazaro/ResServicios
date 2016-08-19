'use strict';
var oracledb = require('resuelvedb');

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if(event.tipo=="empleado"){
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

  var sql = "BEGIN MDM.GET_REF_INCOME_SOURCE(:C_LISTA, :P_ERR_NO, :P_ERR_MSG ); END;";
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
      /*
      for(var i=0;i<(result.rows).length;i++){
        
        var p_item = {
                "comprobante": result.rows[i][2]
              };
        lista.push(p_item);
      }*/
      
      var lista = [];
      var p_item = {
              "comprobante": "Recibo de nómina"
            };
      lista.push(p_item);
      var p_item = {
              "comprobante": "Estado de cuenta"
            };
      lista.push(p_item);
      return cb(null, {
        err:0,
        message:"",
        p_data:lista
      });
    }
  });
  }
  else if(event.tipo=="otro"){
    var lista = [];
    var p_item = {
            "comprobante": "Estado de cuenta"
          };
    lista.push(p_item);
    var p_item = {
            "comprobante": "recibo de pensión"
          };
    lista.push(p_item);
    var p_item = {
            "comprobante": "declaracion de impuestos"
          };
    lista.push(p_item);
    
    return cb(null, {
      err:0,
      message:"",
      p_data:lista
    });
  }
  else{
    var lista = [];
    var p_item = {
            "comprobante": "Declaración de impuestos"
          };
    lista.push(p_item);
    var p_item = {
            "comprobante": "Estado de cuenta"
          };
    lista.push(p_item);

    
    return cb(null, {
      err:0,
      message:"",
      p_data:lista
    });
  }

};