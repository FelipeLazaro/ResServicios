'use strict';

module.exports.handler = function(event, context, cb) {

      var lista = [];
      var migasto=1000;
  for(var i=0;i<20;i++){
    
    var p_item = {
            "gastos": migasto
          };
    lista.push(p_item);
    migasto=migasto+1000;
  }
  return cb(null, {
    err:0,
    message:"",
    p_data:lista
  });
};
