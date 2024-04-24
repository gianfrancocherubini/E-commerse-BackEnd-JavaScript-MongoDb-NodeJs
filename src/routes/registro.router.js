

import { Router } from 'express';
import passport from 'passport';
import { RegistroController} from '../controller/registro.controller.js';

export const router=Router()

router.get('/errorRegistro',RegistroController.registroError);
router.post('/', passport.authenticate('registro', {failureRedirect: '/api/registro/errorRegistro'}), RegistroController.registro);

