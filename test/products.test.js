

import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config.commander.js';

describe('PRUEBA MODULO DE PRODUCTS', function () {
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

    describe('Prueba Router products', function () {

        it('Prueba GET de productos (/). Debe retornar un status 200 el enpoint get que renderiza la pagina home con los productos', async function () {
            const response = await requester.get('/'); 
            expect(response.status).to.equal(200);
        });

        it('Prueba GET de productos por categoria (/?category=computadoras). Debe retornar un status 200 y renderizar productos de la categoría "computadoras"', async function () {
            const response = await requester.get('/?category=computadoras');
            expect(response.status).to.equal(200);
        });
        it('Prueba POST, creacion de producto (/api/products) Debería devolver un código de estado 500 si no hay usuario logueado.', async function() {
            const crearProducto = {
                title: 'Producto de prueba',
                description: 'Descripción del producto',
                price: 10.99,
                thumbnails: ['https://example.com/image.jpg'],
                code: 'ABC123',
                stock: 100,
                category: 'computadora'
            };
            const respuesta = await requester.post('/api/products').send(crearProducto );
            console.log("no permite agregar un producto ya que no hay ningun usuario logueado, por lo tanto, no encuentra el 'rol' del usuario para verificar si es un administrador o usuario.")
            expect(respuesta.statusCode).to.equal(500);
            expect(respuesta.ok).to.be.false;
        });
    });
});