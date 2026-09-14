const db = require('../config/db');

//Función para obtener la factura de una venta
function obtenerPorVenta(ventaId, callback) {

    const sql = `
        SELECT
            factura_id AS id,
            venta_id AS ventaId,
            folio,
            fecha_emision AS fechaEmision,
            rfc,
            nombre_razon_social AS nombreRazonSocial,
            codigo_postal AS codigoPostal,
            regimen_fiscal AS regimenFiscal,
            uso_factura AS usoFactura,
            factura_xml AS facturaXml
        FROM factura
        WHERE venta_id = ?
    `;

    db.query(sql, [ventaId], (error, resultados) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultados[0]);

    });

}

//Función para registrar una factura
function registrar(ventaId, factura, callback) {

    const folio = 'F-' + String(ventaId).padStart(6, '0');

    const sql = `
        INSERT INTO factura (
            venta_id,
            folio,
            fecha_emision,
            rfc,
            nombre_razon_social,
            codigo_postal,
            regimen_fiscal,
            uso_factura,
            factura_xml
        )
        VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        ventaId,
        folio,
        factura.rfc,
        factura.nombreRazonSocial,
        factura.codigoPostal,
        factura.regimenFiscal,
        factura.usoFactura,
        factura.facturaXml || null
    ];

    db.query(sql, valores, (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, {
            id: resultado.insertId,
            folio
        });

    });

}

module.exports = {

    obtenerPorVenta,

    registrar

};
