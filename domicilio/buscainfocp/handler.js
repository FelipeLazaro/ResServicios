'use strict';

var oracledb =require("resuelvedb");

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  console.log("iniciando")
  
  if((event.cp).length == 5){
  var bindvars = {
          "P_CP": {
            "type": "oracledb.VARCHAR2",
            "dir": "oracledb.BIND_IN",
            "val":event.cp
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
  
  
  var sql = "BEGIN MDM.GET_ST_MUN_FROM_CP(:P_CP, :C_LISTA, :P_ERR_NO, :P_ERR_MSG ); END;";
  oracledb
          .execute(sql,
                  bindvars,
                  function(err, result) {
                  if(err){return cb(null, {
                          err:0,
                          message:""});}
                  else{ 
                      
                    
                    var estados=[];
                    var ciudades=[];
                    var municipios=[];
                    var colonias=[];
                   
                    var estado = {
                            "estado": result.rows[0][2],
                            "id_estado": result.rows[0][1]
                          };
                    estados.push(estado);
                    
                    
               
                      var ciudad = {
                              "ciudad": result.rows[0][4],
                              "id_ciudad":  result.rows[0][3],
                              
                            };
                      ciudades.push(ciudad);
                    
                    var municipio = {
                            "municipio": result.rows[0][6],
                            "id_municipio": result.rows[0][5]
                          };
                    municipios.push(municipio);
                    
                    for(var i=0;i<(result.rows).length;i++){
                      
                      
                     
                      
                      var colonia = {
                              "colonia": result.rows[i][8],
                              "id_colonia": result.rows[i][7]
                            };
                      colonias.push(colonia);
                      
                    }
                    
                    
                    return cb(null, {
                      err:0,
                      message:"",
                      "p_data":{"estado":estados,
                        "ciudad":ciudades,
                        "municipio":municipios,
                        "colonia":colonias,
                        }
                    });      

                  }
          });
}
  else{
    return cb(null, {
      err:1,
      message:"el codigo postal debe tener 5 digitos"
    });
    
  }
};
