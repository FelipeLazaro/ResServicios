'use strict';
var jsforce = require('jsforce');
var conn = new jsforce.Connection({
	loginUrl : "https://login.salesforce.com/services/oauth2/authorize",
	instanceUrl : "https://na11.salesforce.com",
});
module.exports.handler = function(event, context, cb) {
    var username = process.env.USERNAME;
 	var	password = process.env.PASSWORD;
 	conn.login(username, password, function(err, userInfo) {
		  if (err) { return console.error(err); }
		  // Now you can get the access token and instance URL information.
		  // Save them to establish connection next time.
		  console.log(conn.accessToken);
		  console.log(conn.instanceUrl);
		  // logged in user property
		  console.log("User ID: " + userInfo.id);
		  console.log("Org ID: " + userInfo.organizationId);
		  // ...
		});

 		var records = [];
		conn.query("SELECT Id, Name  FROM Account LIMIT 5", function(err, result) {
		  if (err) { return console.error(err); }
		  console.log("total : " + result.totalSize);
		  console.log("fetched : " + result.records.length);
		  records = result.records;
		  return cb(err, {
		     records
		  });
		});
};
