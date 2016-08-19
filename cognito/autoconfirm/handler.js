'use strict';

module.exports.handler = function(event, context) {
  if (event.userName.length < 5) {
    context.done("Ingrese un nombre de usuario mayor a 4 caracteres o un correo valido.", event);
    console.log("Username length should be longer than 4");
    throw new Error('failed!');
  }

  // Access your resource which contains the list of emails who were invited to sign-up

  // Compare the list of email id from the request with the approved list
  if(event.userPoolId === "us-east-1_6p6ydQ8Hr") {
    event.response.autoConfirmUser = true;
  }
  // Return result to Cognito
  context.done(null, event);
};
