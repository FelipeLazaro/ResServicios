'use strict';

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if(event.idestado && event.idcolonia){
  
  var lista=[];
 var micolonia="colonia"
  for(var i=0;i<10;i++){
        
        var p_item = {
                "colonia": micolonia+i,
                "id_colonia":i
              };
        lista.push(p_item);
      }
      return cb(null, {
        err:0,
        message:"",
        p_data:lista
      });
  
  
}
  else{
    return cb(null, {
      err:1,
      message:"debe agregar id_estado y id_colonia",
      p_data:{}
    });
    
  }}