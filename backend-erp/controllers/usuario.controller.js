const usuarioService = require('../services/usuario.service');

function login(req, res) {

    const correo = String(req.body.correo || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if(!correo || !password) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    usuarioService.login(correo, password, (error, usuario) => {
        if(error) return res.status(500).json({ mensaje: 'Error al iniciar sesión' });
        if(!usuario) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        res.json(usuario);
    });

}

module.exports = {
    login
};
