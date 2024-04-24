

import { UsuariosModelo } from "./models/usuarios.model.js";

export class UsuariosMongoDao {

    async getUsuarios(usuarioId) {
        try {
            const usuarios = await UsuariosModelo.findById({ _id: usuarioId, rol: "usuario" });
            return usuarios;
        } catch (error) {
            req.logger.error(`Error al obtener los usuarios`);
            throw error;
        }
    }

    async getUsuarioAdmin(adminId) {
        try {
            const administrador = await UsuariosModelo.findById({ _id: adminId, rol: "administrador" });
            return administrador;
        } catch (error) {
            req.logger.error(`Error al obtener administrador`);
            throw error;
        }
    }

    async getTodosUsuarios() {
        try {
            const roles = ['premium', 'usuario']
            const todosUsuarios = await UsuariosModelo.find({ rol: {$in: roles} }).lean();
            return todosUsuarios;
        } catch (error) {
            req.logger.error(`Error al obtener todos los usuarios`);
            throw error;
        }
    }

    async getUsuarioByEmail(email){
        try {
            let existe=await UsuariosModelo.findOne({email})
            return existe;
        }catch(error){
            req.logger.error(`Error al obtener el usuario por email`);
            throw error;
        }
    }

    async getUsuarioById(id){
        try {
            let usuario=await UsuariosModelo.findOne({ _id: id })
            return usuario;
        }catch(error){
            req.logger.error(`Error al obtener el usuario por id`);
            throw error;
        }
    }

    async createAdmin(nombre, email, password, rol) {
        try {
            let usuario = await UsuariosModelo.create({ nombre, email, password, rol: 'administrador' });
            return usuario;
        } catch (error) {
            req.logger.error(`Error al crear administrador`);
            throw error;
        }
    }

    async crearUsuarioRegular(nombre, email, password, idCarrito) {
        try {
            const usuario = await UsuariosModelo.create({ nombre, email, password,carrito: idCarrito });
            return usuario;
        } catch (error) {
            req.logger.error(`Error al crear usuario regular`);
            throw error;
        }
    }

    async getUsuarioByEmailLogin(email) {
        try {
            const usuario = await UsuariosModelo.findOne({ email }).lean();
            return usuario;
        } catch (error) {
            req.logger.error(`Error al crear usuario regular`);
        }
    }


    async modificarUsuarioRol(usuarioId, rolNuevo){
        try {

            const usuarioModificar = await UsuariosModelo.findByIdAndUpdate(
                usuarioId,
                { $set: { rol: rolNuevo } },
                { new: true }
            );
            return usuarioModificar;
            
            
        } catch (error) {
            req.logger.error(`Error al modificar el rol del usuario`);
            throw error;
        }
    }

    async modificarUsuarioPorMail (mail, usuarioActualizado){
        try {
            const modificarUsuario = await UsuariosModelo.updateOne({email:mail}, usuarioActualizado);
            return modificarUsuario;

        } catch(error){
            req.logger.error(`Error al modificar el usuario`);
            throw error;
        }
    }

    async eliminarUsuario (id){
        try {
            const eliminar = await UsuariosModelo.deleteOne({_id: id})
            return eliminar
        } catch (error) {
            req.logger.error(`Error al eliminar el usuario`);
            throw error;
        }
    }

    async eliminarPorInactividad(usuario){
        try {
            const eliminar = await UsuariosModelo.deleteOne(usuario);
            return eliminar;
        } catch (error) {
            req.logger.error(`Error al eliminar el usuario`);
            throw error;
        }
    }

}

