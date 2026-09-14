const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//Crea router para productos y acceder a todas las rutas de este
const productoRouter = require('./routes/producto.routes');
//Agrega /api/productos antes de cada ruta del productoRouter
app.use('/api/productos', productoRouter);

//Crea router para funcionarios y accede a todas las rutas
const funcionarioRouter = require('./routes/funcionario.routes');
//Agrega /api/funcionarios antes de cada ruta 
app.use('/api/funcionarios', funcionarioRouter);

const asistenciaRouter = require('./routes/asistencia.routes');
//Agrega las rutas de asistencias
app.use('/api/asistencias', asistenciaRouter);

const pagoRouter = require('./routes/pago.routes');
//Agrega las rutas de pagos de salario
app.use('/api/pagos', pagoRouter);

const usuarioRouter = require('./routes/usuario.routes');
//Agrega las rutas de usuarios
app.use('/api/usuarios', usuarioRouter);

const finanzaRouter = require('./routes/finanza.routes');
//Agrega las rutas de movimientos financieros
app.use('/api/movimientos-financieros', finanzaRouter);

const proveedorRouter = require('./routes/proveedor.routes');
//Agrega las rutas de proveedores
app.use('/api/proveedores', proveedorRouter);

const compraRouter = require('./routes/compra.routes');
//Agrega las rutas de compras
app.use('/api/compras', compraRouter);

const ventaRouter = require('./routes/venta.routes');
//Agrega las rutas de ventas
app.use('/api/ventas', ventaRouter);

const facturaRouter = require('./routes/factura.routes');
//Agrega las rutas de facturas
app.use('/api/facturas', facturaRouter);

//Escucha el puerto 3000 que es dónde está el servidor del backend
app.listen(3000, () => {
    console.log('Servidor ejecutandose en http://localhost:3000');
});
