

import { Router } from 'express';
import { CarritoController } from '../controller/carrito.controller.js';
import { auth } from "../config/config.auten.autoriz.js";
export const router=Router()

router.post('/:cid/purchase', auth, CarritoController.purchaseTicket);
router.post('/', auth, CarritoController.createCart);
router.post('/:cid/product/:pid', auth,  CarritoController.addProductToCart);
router.delete('/:cid/product/:pid', auth, CarritoController.deleteProductToCart);
router.delete('/:cid', auth, CarritoController.deletedCart);

