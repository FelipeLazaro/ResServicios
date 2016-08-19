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
            "usoCreditoAnterior": [ 
{PutRequest:{Item: {"version":20160516,"id":1,"clave":"PAGD","descripcion":"Pagar deudas"}}},
{PutRequest:{Item: {"version":20160516,"id":2,"clave":"VIAJ","descripcion":"Viaje"}}},
{PutRequest:{Item: {"version":20160516,"id":3,"clave":"INNG","descripcion":"Iniciar negocio"}}},
{PutRequest:{Item: {"version":20160516,"id":4,"clave":"ESTD","descripcion":"Estudios"}}},
{PutRequest:{Item: {"version":20160516,"id":5,"clave":"MEHG","descripcion":"Mejoras al hogar"}}},
{PutRequest:{Item: {"version":20160516,"id":6,"clave":"OTRO","descripcion":"Otro"}}}
                          ],
        },
        ReturnConsumedCapacity: 'NONE', 
        ReturnItemCollectionMetrics: 'NONE'
    };


    docClient.batchWrite(params, function(err, data) {
        if (err) console.log(data); 
        else console.log(data) 
    });