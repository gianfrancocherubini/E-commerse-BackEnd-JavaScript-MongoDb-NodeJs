

import { Router } from 'express';
import { UsuarioController } from '../controller/usuario.controller.js';
import { auth } from "../config/config.auten.autoriz.js";

export const router=Router()

router.post('/consultasWs', auth,  UsuarioController.consultasWs);
router.post('/premium/:cid', auth, UsuarioController.cambiarUsuario);
router.post('/recupero01', UsuarioController.recuperoPassword01);
router.post('/recupero03', UsuarioController.recuperoPassword03);
router.delete('/delete/:cid', auth, UsuarioController.eliminarUsuarioDeBaseDeDatos);
router.delete('/inactividad', auth, UsuarioController.eliminarPorInactividad);