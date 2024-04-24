

import { ProductsController } from "../controller/products.controller.js";
import { CarritoController } from '../controller/carrito.controller.js';
import { RegistroController } from '../controller/registro.controller.js';
import { LoginController} from '../controller/login.controller.js';
import { UsuarioController } from '../controller/usuario.controller.js';
import { LogoutController } from '../controller/logout.controller.js';
import { auth, auth2} from "../config/config.auten.autoriz.js";
import { Router } from 'express';

export const router=Router();

router.get('/',(req, res, next) => {
    // Pasa la información del usuario a la vista "home" solo si se ha iniciado sesión
    if (req.session.usuario) {
        res.locals.usuario = req.session.usuario;

        // Verifica si la consulta 'login' está presente y muestra el mensaje de bienvenida
        if (req.query.login === 'success') {
            res.locals.welcomeMessage = true;
        }
    }

    next();
}, ProductsController.getProducts);
router.get('/carrito/:cid', auth, CarritoController.getCartById);
router.get('/registro', auth2, RegistroController.registroRender);
router.get('/usuario', auth, UsuarioController.perfilUsuario);
router.get('/login', auth2, LoginController.loginRender);
router.get('/logout', auth, LogoutController.logoutUsuario );
router.get('/recuperoPassword', UsuarioController.renderRecuperoPassword);
router.get('/recuperoPassword02', UsuarioController.renderRecuperoPassword02);
router.get('/usuarios', auth, UsuarioController.obtenerTodosUsuarios);