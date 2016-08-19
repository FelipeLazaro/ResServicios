/**
 * http://usejsdoc.org/
 */

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAJDV4BWUE6BTCCNQA",
  secretAccessKey: "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"
});
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
        RequestItems: { 
            "cotizador": [ 
//                          {PutRequest:{Item: {"version":20160516,"plazo":6, "tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.17","factor_max":"0.18"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":7, "tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.15","factor_max":"0.16"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":8, "tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.13","factor_max":"0.14"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":9, "tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.12","factor_max":"0.13"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":10,"tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.10","factor_max":"0.12"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":11,"tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.10","factor_max":"0.11"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":12,"tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.09","factor_max":"0.10"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":13,"tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.08","factor_max":"0.09"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":14,"tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.08","factor_max":"0.09"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":15,"tasa_min":"8.90%","tasa_max":"27.90%","factor_min":"0.07","factor_max":"0.08"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":16,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.07","factor_max":"0.08"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":17,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.06","factor_max":"0.07"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":18,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.06","factor_max":"0.07"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":19,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.06","factor_max":"0.07"}}},
//                          {PutRequest:{Item: {"version":20160516,"plazo":20,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.06","factor_max":"0.07"}}}
                          
                          {PutRequest:{Item: {"version":20160516,"plazo":21,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":22,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":23,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":24,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":25,"tasa_min":"9.90%","tasa_max":"28.90%","factor_min":"0.05","factor_max":"0.06"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":26,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.06"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":27,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":28,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":29,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":30,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":31,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":32,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":33,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":20160516,"plazo":34,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.04","factor_max":"0.05"}}},
                          {PutRequest:{Item: {"version":201605162,"plazo":35,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.03","factor_max":"0.05"}}},        
                          {PutRequest:{Item: {"version":201605162,"plazo":36,"tasa_min":"10.90%","tasa_max":"29.90%","factor_min":"0.03","factor_max":"0.05"}}}
                          ],
        },
        ReturnConsumedCapacity: 'NONE', 
        ReturnItemCollectionMetrics: 'NONE'
    };


    docClient.batchWrite(params, function(err, data) {
        if (err) console.log(data); 
        else console.log(data) 
    });