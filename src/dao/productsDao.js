

import { ProductEsquema } from "./models/products.model.js";

export class ProductsMongoDao {

    async get(query) {
        try {
            const products = await ProductEsquema.find({ ...query, deleted: false }).lean();
            return products;
        } catch (error) {
            req.logger.error(`Error al obtener productos`);
            throw error;
        }
    }

    async getById(productId) {
        try {
            const product = await ProductEsquema.findById({ _id: productId, deleted: false });
            return product;
        } catch (error) {
            req.logger.error(`Error al obtener producto por ID`);
            throw error;
        }
    }

    async getByCode(productByCode) {
        try {
            const productCode = await ProductEsquema.findOne({ code: productByCode });
            return productCode;
        } catch (error) {
            req.logger.error(`Error al obtener producto por código`);
            throw error;
        }
    }

    async create(product) {
        try {
            const newProduct = await ProductEsquema.create(product);
            return newProduct;
        } catch (error) {
            req.logger.error(`Error al crear producto`);
            throw error;
        }
    }

    async updateProduct(productId, updatedData) {
        try {
            const updatedProduct = await ProductEsquema.findByIdAndUpdate(
                { _id: productId },
                { $set: updatedData },
                { new: true } // Devuelve el documento modificado
            );
            return updatedProduct;
        } catch (error) {
            req.logger.error(`Error al actualizar producto`);
            throw error;
        }
    }

    async deleteProduct (productId){
        try {
            const deletedProduct = await ProductEsquema.findByIdAndDelete(productId);
            return deletedProduct;
        } catch (error) {
            req.logger.error(`Error al eliminar producto`);
            throw error;
        }

    }
}