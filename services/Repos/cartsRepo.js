import CartModel from "../../persistence/models/cartModel.js";
import ProductModel from "../../persistence/models/productModel.js";
import CartDaoMongo from "../../persistence/DAOS/cartDaoMongo.js";

export default class CartsRepo {
    dao

    constructor() {
        this.dao = CartDaoMongo.createCart('carts');
    }
    
    async saveCart() {
        const newCartId = await this.dao.saveCart()
        return newCartId
    }

    async deleteCartById(id) {
        const deletedCart = await this.dao.deleteCartById(id)
        return new CartModel(deletedCart).datos()
    }

    async getCartById(id) {
        const productsInCart = await this.dao.getCartById(id)
        return productsInCart.map(p => new ProductModel(p).datos());
    }

    async saveProductToCart(id, product) {
        await this.dao.saveProductToCart(id, product)
    }

    async deleteProdById(cartId, product) {
        await this.dao.deleteProdById(cartId, product)
    }

    async emptyCartById(cartId) {
        await this.dao.emptyCartById(cartId)
    }
}
