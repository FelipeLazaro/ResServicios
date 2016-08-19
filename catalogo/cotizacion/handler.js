'use strict';

var oracledb =require("resuelvedb");

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  var plazo = parseInt(event.plazo);
  var monto = parseInt(event.monto);
  if (!event.plazo || !event.monto) {

    return cb(null, {err:1,
      message:"Por favor especifique el monto y plazo de su credito.",
      p_data:{}});
  }

  else if (isNaN(plazo)||isNaN(monto)) {
    
    return cb(null, {err:1,
      message:"Plazo o monto invalido.",
      p_data:{}});
  }
  else if(parseInt(plazo)>=37 || parseInt(plazo)<=5 || parseInt(monto)<30000 || parseInt(monto)>350000){
    return cb(null, {err:1,
      message:"Plazo o monto no aceptable.",
      p_data:{}});
  }
  else{
  var bindvars = {
    "P_MONTO": {
      val:event.monto,
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_IN"
    },
    "P_PLAZO": {
      val:event.plazo,
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_IN"
    },
    "P_TIPO_PLAZO": {
      val:3,
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_IN"
    },
    "P_TASA_INF": {
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_OUT"
    },
    "P_TASA_SUP": {
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_OUT"
    },
    "P_PAGO_INF": {
      "type": "oracledb.NUMBER",
      "dir": "oracledb.BIND_OUT"
    },
    "P_PAGO_SUP": {
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


  var sql = "BEGIN SCH_LATASA.GET_AMOUNT_BY_TERM(:P_MONTO, :P_PLAZO, :P_TIPO_PLAZO, :P_TASA_INF, :P_TASA_SUP, :P_PAGO_INF, :P_PAGO_SUP, :P_ERR_NO, :P_ERR_MSG); END;";
  oracledb.execute(sql, bindvars, function(err, result) {

    if (err) {
      console.log(err)
      return cb(null, { "p_data": {
      },
      "err": "1",
      "message": "error - "+err});
    }
    
    else{
      console.log(result.outBinds.P_PAGO_INF)
      

      
     return cb(null, {  "p_data": {
       "plazo":event.plazo,
       "tasa_min": result.outBinds.P_TASA_INF.toFixed(2)+"%",
       "tasa_max": result.outBinds.P_TASA_SUP.toFixed(2)+"%",
       "pago_mensual_min": result.outBinds.P_PAGO_INF,
       "pago_mensual_max": result.outBinds.P_PAGO_SUP
     },
     "err": "0",
     "message": ""});
     }
   });
  }
 };


