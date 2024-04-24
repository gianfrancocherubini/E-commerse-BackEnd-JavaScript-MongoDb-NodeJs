

import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";
import { auth } from "../config/config.auten.autoriz.js";
export const router=Router();


router.post('/', auth,   ProductsController.createProduct);
router.put('/:pid', auth, ProductsController.updateProduct);
router.delete('/:pid', auth,  ProductsController.deleteProduct);

