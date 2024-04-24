

import { UsuariosMongoDao } from '../dao/usuariosDao.js';
const usuariosDao =new UsuariosMongoDao()

export class LoginController {
    constructor(){}

    static async loginRender(req,res){
        let { error, message } = req.query;
        let usuario = req.session.usuario
        let admin;
            if(usuario && usuario.rol === 'administrador'){
                admin = true;
            } else {
                admin = false;
            }    
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('login', { error, message, login: false, admin: admin });
    }

    static async loginLocalError(req,res){
        return res.redirect('/login?error=Error en el proceso de login... :(')
    }

    static async loginLocal(req, res) {

        const fechaHoraArgentina = new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' });
        
        const fechaHoraLogin = new Date(fechaHoraArgentina).toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    
        try {
            
            const updatedUser = await usuariosDao.modificarUsuarioPorMail(
                req.user.email,
                { $set: { last_connection: fechaHoraLogin } }
            );
    
            if (!updatedUser) {
                req.logger.error('Usuario no encontrado en la base de datos');
            } else {

                req.session.usuario = {
                    id: req.user._id,
                    nombre: req.user.nombre,
                    email: req.user.email,
                    rol: req.user.rol,
                    carrito: req.user.carrito
                };
                req.logger.info(`Inicio sesión el usuario: ${req.session.usuario.nombre}`);
            }
        } catch (error) {
            req.logger.error('Error al actualizar la última conexión del usuario:');
        }
    
        res.redirect('/');
    }
}
