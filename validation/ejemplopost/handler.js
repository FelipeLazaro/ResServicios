'use strict';

module.exports.handler = function(event, context, cb) {
  

 console.log("event - "+JSON.stringify(event,null,2))
  
  console.log(event)

  console.log(context)
  
  console.log(cb)
  
  return cb(null, {
    
    message: 'usuario : '+event.val1
  });
};
