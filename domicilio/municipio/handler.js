'use strict';

var oracledb =require("resuelvedb");

module.exports.handler = function(event, context, cb) {
context.callbackWaitsForEmptyEventLoop = false;
  
  console.log("estado...")
  
 
  var bindvars = {
          "P_ESTADO": {
            "type": "oracledb.VARCHAR2",
            "dir": "oracledb.BIND_IN",
            val:event.estado
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
  
  
  var sql = "BEGIN MDM.GET_MUN_FROM_ST(:P_ESTADO, :C_LISTA, :P_ERR_NO, :P_ERR_MSG ); END;";
  oracledb
          .execute(sql,
                  bindvars,
                  function(err, result) {
                  if(err){
                    return cb(null, err);                  
                  }  
                  else{
                   
                    var lista=[];
                    var ciudade=[];
                    
                  /*  var ciudad = {
                            "ciudad": result.rows[0][0],
                            "id_ciudad":10233
                          };
                    ciudade.push(ciudad);*/
                for(var i=0;i<(result.rows).length;i++){   
                  
                      var municipio = {
                              "municipio": result.rows[i][2],
                              "id_municipio": result.rows[i][1]
                            };
                      lista.push(municipio);
                      
                      
                      if(result.rows[i][3]!=null){
                      var ciudad = {
                              "ciudad": result.rows[i][3],
                              "id_ciudad":10233+i
                            };
                      ciudade.push(ciudad);
                      }
                    }
                
                var ciudad = {
                        "ciudad": "no aplica",
                          "id_ciudad":10240
                      };
                ciudade.push(ciudad);
                
                    return cb(null, {
                      err:0,
                      message:"",
                      p_data:{
                        ciudad:ciudade,
                        municipio:lista
                        
                      }
                    });
                   
                  
                  }
          });



 
};