

import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config.commander.js';


describe('PRUEBA MODULO DE CARTS', function () {
    this.timeout(7000);

    before(async function () {
        try {
            await mongoose.connect(config.MONGO_URL, { dbName: config.DBNAME });
            console.log("BD Online");
        } catch (error) {
            console.log(error.message);
            process.exit(1);
        }
    });

    after(async function () {
        await mongoose.disconnect();
        console.log("BD Desconectada");
    });

    const requester = supertest('http://localhost:3012');

    describe('Prueba Router carrito', function () {

        it('Prueba POST. Debe retornar un status 201 al crear un carrito (/api/carts)', async function () {
            const response = await requester.post('/api/carts').send(); 
            expect(response.status).to.equal(201); 
        });
        it('Prueba GET, renderizado de carrito por id. (/carrito/:cid)=> Debe renderizar el carrito por id y responder con status 200', async function () {
            const cartId = '660de84a959c6f10e0f0147c';
            const response = await requester.get(`/carrito/${cartId}`);
            expect(response.status).to.equal(200);
        });
        it('Prueba DELETE, eliminar carrito por id. (/c/:cid)=> Debe eliminar el carrito por id y responder con status 200', async function () {
            const cartId = '660de84a959c6f10e0f0147c7';
            const response = await requester.delete(`/api/carts/${cartId}`);
            expect(response.status).to.equal(200);
        });

    });
});