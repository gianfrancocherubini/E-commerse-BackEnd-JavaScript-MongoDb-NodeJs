

import { generateMockedProducts } from "../dao/mockingDao.js";

export class MockingController {
    constructor(){}

    static async mockingProducts (req, res) {
        try {
            let { cantidad } = req.query;
            cantidad = parseInt(cantidad); 

            if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: "Ingrese una cantidad válida." });
            }

            const productos = generateMockedProducts(cantidad);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: productos });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }
}