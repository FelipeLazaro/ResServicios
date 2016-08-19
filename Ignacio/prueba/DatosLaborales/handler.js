'use strict';

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

  console.log(event);

  var JSONinput = (event != null)?event:null;

  var datosPermitidosNull = ["token","clave_ciec","comprobante"];

  if(JSONinput != null && JSONinput.hasOwnProperty('username') && JSONinput.prestatario_alta.hasOwnProperty('laboral') && jsonEmpty(JSONinput.laboral,datosPermitidosNull)){
  	var params = {
      TableName: "prestatario",
      FilterExpression: 'username = :user',
      ExpressionAttributeValues: {
      ':user': JSONinput.username
      }
    }  
    dynamo.scan(params, function(err, data) {
	    if(err) {
	      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
	      responseData(1,"Ocurrio un error al conectarse a la BD",err);  
	   	}else if(parseInt(data.Count) < 1) {
	   		responseData(1,"Error, no hay usuario registrado",{});
	   	}else{
	   		var corr=data.Items[0].correo;
        var usern=data.Items[0].username;
        
        var pantalla=5;
        
        var fecha_mod = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
				
				if(!JSONinput.prestatario_alta.laboral.ocupacion || !JSONinput.username){
					responseData(1,'no has mandado ocupacion (empleado, empresario, u otro), o usuario',{});
			  }else if(!JSONinput.prestatario_alta.laboral.subir_despues && JSONinput.prestatario_alta.laboral.clave_ciec == null){
			  	if(JSONinput.prestatario_alta.laboral.comprobante.length <= 0){
			  		responseData(1,'debes agregar un comprobante de ingresos con su informacion',{});
			  	}else if(!JSONinput.prestatario_alta.laboral.comprobante[0].img_comprobante_ingresos || !JSONinput.prestatario_alta.laboral.comprobante[0].tipo_comprobante){
			  		responseData(1,'debes agregar un comprobante de ingresos con su informacion',{});
			  	}
			  }else if(JSONinput.prestatario_alta.laboral.ocupacion=="empleado" && (!JSONinput.prestatario_alta.laboral.sector || !JSONinput.prestatario_alta.laboral.tipo_contratacion || !JSONinput.prestatario_alta.laboral.actividad_profesional || !JSONinput.prestatario_alta.laboral.tiempo_empleo_actual || !JSONinput.prestatario_alta.laboral.nivelestudios || !JSONinput.prestatario_alta.laboral.ingreso_mensual_libre)){
			  	responseData(1,'agregue toda la informacion para empleado',{});	
			  }else if(JSONinput.prestatario_alta.laboral.ocupacion=="empresario" && (!JSONinput.prestatario_alta.laboral.actividad_profesional || !JSONinput.prestatario_alta.laboral.nivelestudios || !JSONinput.prestatario_alta.laboral.ingreso_mensual_libre || !JSONinput.prestatario_alta.laboral.gastos_mensuales || !JSONinput.prestatario_alta.laboral.tiempo_actividad)){
			  	responseData(1,'agregue toda la informacion para empresario',{});
			  }else if(JSONinput.prestatario_alta.laboral.ocupacion=="otro" && (!JSONinput.prestatario_alta.laboral.nivelestudios || !JSONinput.prestatario_alta.laboral.ingreso_mensual_libre || !JSONinput.prestatario_alta.laboral.como_recibes_ingresos)){
			  	responseData(1,'agregue toda la informacion para otro',{});
			  }else{
			    if(JSONinput.prestatario_alta.laboral.ocupacion!="empleado" && JSONinput.prestatario_alta.laboral.ocupacion!="empresario" && JSONinput.prestatario_alta.laboral.ocupacion!="otro"){
			    	responseData(1,'ocupacion no identificada, use empleado, empresario u otro',{});
			    }
      	}
      	var params = {
          TableName:"prestatario",
          Key:{
          "username": usern,
          "correo": corr
              },
          UpdateExpression: "set laboral.ocupacion = :oc," +
              " laboral.tipo_contratacion=:tc," +
              " laboral.actividad_profesional = :ap," +
              " laboral.tiempo_empleo_actual = :te," +
              " laboral.nivelestudios = :ne," +
              " laboral.ingreso_mensual_libre = :im," +
              " laboral.comprobante = :comprobantes," +
              " laboral.gastos_mensuales = :gm," +
              " laboral.tiempo_actividad = :tieac," +
              " laboral.sector = :sec," +
              " laboral.como_recibes_ingresos = :recing," +
              " laboral.clave_ciec = :ciec," +
              " laboral.subir_despues = :sd,"+
              " solicitud.pantalla = :pantalla," +
              " solicitud.fecha_ultima_actualizacion  = :fecha",
          ExpressionAttributeValues:{
              ":oc":JSONinput.prestatario_alta.laboral.ocupacion,
              ":tc":(JSONinput.prestatario_alta.laboral.tipo_contratacion === undefined)?null:JSONinput.prestatario_alta.laboral.tipo_contratacion,
              ":ap":(JSONinput.prestatario_alta.laboral.actividad_profesional === undefined)?null:JSONinput.prestatario_alta.laboral.actividad_profesional,
              ":te":(JSONinput.prestatario_alta.laboral.tiempo_empleo_actual === undefined)?null:JSONinput.prestatario_alta.laboral.tiempo_empleo_actual,
              ":ne":JSONinput.prestatario_alta.laboral.nivelestudios,
              ":im":JSONinput.prestatario_alta.laboral.ingreso_mensual_libre,
              ":comprobantes":JSONinput.prestatario_alta.laboral.comprobante,
              ":gm":(JSONinput.prestatario_alta.laboral.gastos_mensuales === undefined)?null:JSONinput.prestatario_alta.laboral.gastos_mensuales,
              ":tieac":(JSONinput.prestatario_alta.laboral.tiempo_actividad === undefined)?null:JSONinput.prestatario_alta.laboral.tiempo_actividad,
              ":sec":(JSONinput.prestatario_alta.laboral.sector === undefined)?null:JSONinput.prestatario_alta.laboral.sector,
              ":recing":(JSONinput.prestatario_alta.laboral.como_recibes_ingresos === undefined)?null:JSONinput.prestatario_alta.laboral.como_recibes_ingresos,
              ":ciec":JSONinput.prestatario_alta.laboral.clave_ciec,
              ":sd":JSONinput.prestatario_alta.laboral.subir_despues,
              ":pantalla":pantalla,
              ":fecha":fecha_mod
          },
          ReturnValues:"UPDATED_NEW"
      	};
      	
      	dynamo.update(params, function(err, data) {
      		if(err){
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            responseData(1,"error al guardar identificacion "+err,{});
          }else{
          	console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          	responseData(0,"Datos laborales guardados",JSONinput.prestatario_alta.laboral);
          }	
      	});
			}	  
    });	
	}else{
  	responseData(1,"Error en JSONinput faltan datos por llenar",JSONinput);      	
  }

  function jsonEmpty(data,datosPermitidosNull){
    var valorProperty;
    var respuesta = true;
    for(var property in data){
      if(Object.prototype.hasOwnProperty.call(data,property)){
        valorProperty = data[property];
        if(valorProperty === "null" || valorProperty === null || valorProperty === "" || typeof valorProperty === "undefined" || valorProperty.length <= 0){
          if(datosPermitidosNull.indexOf(property) < 0){
            respuesta =  false;
          }      
        }else{
          if(typeof valorProperty === 'object'){
            respuesta = jsonEmpty(valorProperty,datosPermitidosNull);
          }
        }
      }
      if(!respuesta){
        break;
      }
    }
    return respuesta;
  }

  function responseData(error,mensaje,JSONinput){
    return cb(null,{
      err: error,
      message: mensaje,
      p_data:JSONinput 
    });     
  }
};
