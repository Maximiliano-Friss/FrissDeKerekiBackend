import ProductsFactory from '../../persistence/factories/productFactory.js'
import ProductModel from '../../persistence/models/productModel.js';

export default class ProductsRepo {
    dao

    constructor() {
        this.dao = ProductsFactory.getProducts();
    }
    
    async saveProduct(product) {
        const savedProduct = await this.dao.save(product)
        return new ProductModel(savedProduct).datos()
    }
    
    async getProductById(id) {
        const product = await this.dao.getById(id)
        if(product) {return new ProductModel(product).datos()}
    }
    
    async getAllProducts(category) {
        const products = await this.dao.getAll(category)
        return products ? products.map(p => new ProductModel(p).datos()) : []
    }

    async updateProduct(id, product) {
        const updatedProd = await this.dao.update(id, product)
        if (product) {return updatedProd}
    }

    async deleteProductById(id) {
        const deletedProduct = await this.dao.deleteById(id)
        if(deletedProduct) {return deletedProduct}
    }
}
