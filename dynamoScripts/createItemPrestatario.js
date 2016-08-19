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
  TableName: "prestatario",
  Item: {
    "correo": "borosio@gmail.com",
    "username": "borosio",
    "password":"pass"
    "cotizador": {
      "monto_solicitado": 40000,
      "plazo_solicitado": 12,
      "aplicar_en": "Estudios",
      "tasa_min": 0.14,
      "tasa_max": ".16",
      "factor_min_pago": ".18",
      "factor_max_pago": ".22",
      "tiene_deuda_anterior": "Sí",
      "deuda_anterior": {
        "monto_deuda": 20000,
        "pago_mensual": 2000,
        "aplicado_en": "Viaje"
      }
    },
    "perfil": {
      "nombres": "Beatriz Adriana",
      "apaterno": "Orosio",
      "amaterno": "Cerezo"
    },
    "solicitud": {
      "estatus_correo":0,
      "estatus": "temporal",
      "fecha_ultima_actualizacion": "11/05/2016 15:31:11",
      ""
    }
  }
};

docClient.put(params, function(err, data) {
  if (err)
    console.log(JSON.stringify(err, null, 2));
  else
    console.log(JSON.stringify(data, null, 2));
});