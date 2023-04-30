import mongoose from 'mongoose';
import { loggerErrorController, loggerController } from '../../controllers/loggerControllers.js';
import * as models from '../databases/mongo/models/models.js'
import {URL, replaceId} from '../databases/mongo/mongoConfig.js'
import {transformProductsToDTO} from '../DTOs/productsDTO.js';

let instance = null;

class CartDaoMongo {
    name

    constructor(name){
        this.name = name;
        this.mongoConnect();
    }

    async mongoConnect() {
        await mongoose.set("strictQuery", false);

        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    async saveCart() {
        try{
            const newCart = await models.carritos().save()
            replaceId(newCart)
            loggerController(`Se creó un nuevo carrito con id: ${newCart.id}`)
            return newCart.id
        }
        catch(err){
            loggerErrorController(err)
        }
    }
    
    async emptyCartById(id) {
        try{
            const emptyCart = await models.carritos.findByIdAndUpdate(id,{$set: {productos: []}})
            loggerController(`Se vacía el carrito con id ${id}`)
        }
        catch(err){
            loggerErrorController(err)
        }
    }

    async getCartById(id) {
        try{
            const productsInCart = await models.carritos.findById(id,{productos:1, _id:0})
            loggerController(`Se devuelve el producto del carrito con id: ${id}`)
            return transformProductsToDTO(productsInCart.productos)
        }
        catch(err){
            loggerErrorController(err)
        }
    }
    
    async saveProductToCart(id, product) {
        try {
            const increaseProd = await models.carritos.findOneAndUpdate({ _id: id, "productos.id": product.id }, { $inc: { "productos.$.cantidad": 1 } });
            if (!increaseProd){
                await models.carritos.findOneAndUpdate({ _id: id}, { $push: { productos: product } });
                loggerController(`Se guardó un nuevo producto en el carrito con id ${id}`);
                return
            }
            loggerController(`Se agregó una unidad del producto con id ${product.id} al carrito con id ${id}`);
            return
        } catch (err) {
            loggerErrorController(err);
        }
    }

    async deleteProdById(id, product) {
        try {
            const decreaseProd = await models.carritos.findOneAndUpdate({ _id: id, "productos.id": product.id }, { $inc: { "productos.$.cantidad": -1 } });
            const prodIndex = decreaseProd.productos.findIndex((prod) => prod.id === product.id)
            if(decreaseProd.productos[prodIndex].cantidad == 1){
                await models.carritos.findOneAndUpdate({ _id: id}, { $pull: { productos: { id: product.id } } });
                loggerController(`Se eliminaron todas las unidades del producto con id ${product.id} del carrito con id ${id}`);
                return
            }
            loggerController(`Se quitó una unidad del producto con id ${product.id} del carrito con id ${id}`);
        } catch (err) {
            loggerErrorController(err);
        }
    }

    static createCart(name) {
        if(!instance) {
            instance = new CartDaoMongo(name)
        }
        return instance
    }
}

export default CartDaoMongo