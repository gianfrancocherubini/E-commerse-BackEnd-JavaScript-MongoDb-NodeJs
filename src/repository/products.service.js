

import { ProductsMongoDao } from "../dao/productsDao.js";

export class ProductsService {
    constructor() {
        this.productsDao = new ProductsMongoDao();
    }

    async getProducts(query) {
        return await this.productsDao.get(query);
    }


    async getProductByCode(productByCode){
        return await this.productsDao.getByCode(productByCode);
    }

    async createProduct(product){
        return await this.productsDao.create(product);
    }

    async getProductById(productId){
        return await this.productsDao.getById(productId);
    }


    async update(productId, updatedData){
        return await this.productsDao.updateProduct(productId, updatedData)
    }

    async delete(productId){
        return await this.productsDao.deleteProduct(productId)
    }
}



