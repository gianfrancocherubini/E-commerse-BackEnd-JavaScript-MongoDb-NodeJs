

import { CarritoMongoDao } from "../dao/carritoDao.js";

export class CarritoService{
    constructor(){
        this.carritoDao = new CarritoMongoDao();
    }

    async createCart(){
        return await this.carritoDao.createEmptyCart();
    }

    async cartById(cartId){
        return await this.carritoDao.getCartById(cartId);
    }

    async addProduct(cartId, productId, quantity){
        return await this.carritoDao.addProductToCart(cartId, productId, quantity);
    }

    async deleteProduct(cartId, productId){
        return await this.carritoDao.deleteProductFromCart(cartId, productId);
    }

    async cartDelete(cartId){
        return this.carritoDao.deleteCart(cartId);
    }
}





