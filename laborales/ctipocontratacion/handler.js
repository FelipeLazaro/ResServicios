'use strict';

module.exports.handler = function(event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var contratacion=[];
  var j=6;
    var p_item = {
            "contratacion": "aprenizaje"
          };
    contratacion.push(p_item);
    var p_item = {
            "contratacion": "temporal"
          };
    contratacion.push(p_item);
    var p_item = {
            "contratacion": "indefinido"
          };
    contratacion.push(p_item);
 
  
  return cb(null, {
    err:0,
    message:"",
    p_data:contratacion 
  });
};
