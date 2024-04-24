

import { UsuariosMongoDao } from '../dao/usuariosDao.js';
const usuariosDao =new UsuariosMongoDao()

export class LogoutController {
    constructor(){}

    static async logoutUsuario(req, res) {
        try {
            // Actualizar la última conexión del usuario antes de destruir la sesión
            const fechaHoraArgentina = new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' });
            const fechaHoraLogout = new Date(fechaHoraArgentina).toLocaleString('es-AR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
    
            const updatedUser = await usuariosDao.modificarUsuarioPorMail(
                req.session.usuario.email,
                { $set: { last_connection: fechaHoraLogout } }
            );
    
            if (!updatedUser) {
                req.logger.error('Usuario no encontrado en la base de datos');
            } 
        } catch (error) {
            req.logger.error('Error al actualizar la última conexión del usuario:', error);
        }
    
        // Destruir la sesión
        req.logger.info(`Logout del usuario ${req.session.usuario.nombre}`);
        req.session.destroy(error => {
            if (error) {
                res.status(500).redirect('/login?error=fallo en el logout');
                return;
            }
            res.redirect('/login');
        });
    }

}