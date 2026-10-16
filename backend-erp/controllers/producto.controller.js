const productoService = require('../services/producto.service');

function obtenerProductos(req, res) {
    //Llama al método de obtenerProductos
    productoService.obtenerProductos(
        (error, productos) => {
            //En caso de error devuelve un status 500 y mensaje de error
            if(error){
                return res.status(500).json({
                    mensaje: 'Error al consultar productos'
                });
            }
            //De lo contrario se devuelve el resultado JSON
            res.json(productos);
        }
    );
}

function obtenerProductoPorId(req, res) {
    const id = req.params.id;
    
    productoService.obtenerProductoPorId(id, (error, producto) => {
        //Maneja errores al realizar acción
        if(error) {
            return res.status(500).json({
                mensaje: 'Error al consultar el producto'
            });
        }
        if(!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }
        //Devuelve el producto encontrado
        res.json(producto);
    });
}

function registrarProducto(req, res) {
    const producto = req.body;

    productoService.registrarProducto(producto, (error, resultado) => {
        //Mensaje a mostrar en caso de error
        if(error) {
            return res.status(500).json({
                mensaje: 'Error al registrar el producto'
            });
        }
        //Lo que devuelve en caso de se registre correctamente
        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            id: resultado.insertId
        });
    });
}

function desactivarProducto(req, res) {
    const id = req.params.id;

    productoService.desactivarProducto(id, (error, resultado) => {
        if(error) {
            return res.status(500).json({
                mensaje: 'Error al desactivar el producto'
            });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }
        res.json({
            mensaje: 'Producto desactivado correctamente'
        });
    });
}

function crearNuevaVersion(req, res) {
    const id = req.params.id;
    const producto = req.body;

    productoService.crearNuevaVersion(id, producto, (error, resultado) => {
        if(error){
            //Verifica si el error fue que no se encontró el producto
            if(error.message === 'Producto no encontrado'){
                return res.status(404).json({
                    mensaje: error.message
                });
            }
            return res.status(500).json({
                mensaje: 'Error al crear la nueva versión del producto'
            });
        }
        res.status(201).json({
            mensaje: 'Nueva versión creada correctamente',
            id: resultado.insertId
        });
    });
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    registrarProducto,
    desactivarProducto,
    crearNuevaVersion
};
