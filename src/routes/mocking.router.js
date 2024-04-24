

import { MockingController } from '../controller/mocking.controller.js';
import { auth } from "../config/config.auten.autoriz.js";
import { Router } from 'express';
export const router=Router();

router.get('/', auth, MockingController.mockingProducts);