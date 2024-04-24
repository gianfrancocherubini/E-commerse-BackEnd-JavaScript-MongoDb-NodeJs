

import passport from 'passport';
import { Router } from 'express';
import { LoginController} from '../controller/login.controller.js';
export const router=Router()



// ESTRATEGIA DE AUTENTICACION LOCAL
router.get('/error',LoginController.loginLocalError);
router.post('/', passport.authenticate('login', {failureRedirect: '/api/login/error'}), LoginController.loginLocal);

