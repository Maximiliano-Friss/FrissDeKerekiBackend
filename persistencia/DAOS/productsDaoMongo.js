import mongoose from 'mongoose';
import * as models from '../databases/mongo/models/models.js'
import {loggerController, loggerErrorController} from '../../controllers/loggerControllers.js';
import { transformProductsToDTO } from '../DTOs/productsDTO.js';
import {replaceId} from '../databases/mongo/mongoConfig.js'

let instance = null;

class ProductsDaoMongo {
    constructor(name, URL){
        this.name = name;
        this.mongoConnect(URL);
    }

    async mongoConnect(connectionString) {
        await mongoose.set("strictQuery", false);

        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    async save(product) {
        try{
            const newProd = await models.productos(product).save()
            replaceId(newProd)
            loggerController('Se guardó un nuevo producto')
            return transformProductsToDTO(newProd)
        }
        catch(err){
            loggerErrorController('Error al guardar nuevo producto ' + err)
        }
    }

    async getById(id) {
        try{
            const foundProd = await models.productos.findById(id).lean()
            if(foundProd) {
                replaceId(foundProd)
                loggerController(`Se devuelve producto con id: ${id}`)
                return transformProductsToDTO(foundProd)
            } else {
                loggerController(`No se encuentra producto con id: ${id}`)
                return null
            }
        }
        catch(err){
            loggerErrorController('Error al buscar producto por ID: ' + err)
        }
    }

    async getAll(categoria) {
        try{
            const pipeline = [{$project: {id: "$_id", nombre: 1, precio: 1, foto: 1, categoria: 1, descripcion: 1}}];
            if (categoria) {
                const categoriaLower = categoria.toLowerCase()
                pipeline.unshift({ $match: { categoria: categoriaLower } });
            }
            const allProd = await models.productos.aggregate(pipeline);
            loggerController('Se muestran todos los productos')
            return transformProductsToDTO(allProd)
        }
        catch(err){
            loggerErrorController('Error al buscar todos los productos: ' + err)
        }
    }

    async update(id, updProduct) {
        try{
            const updatedProd = await models.productos.findByIdAndUpdate(id,{$set: updProduct},{new: true})
            if(updatedProd) {
                replaceId(updatedProd)
                loggerController(`Se actualizó el producto con id ${id}`)
                return transformProductsToDTO(updatedProd)
            } else {
                loggerController(`No se encontró el producto con id ${id}`)
            }
        }
        catch(err){
            loggerErrorController('Error al actualizar el producto: ' + err)
        }
    }

    async deleteById(id) {
        try{
            const delProd = await models.productos.findByIdAndDelete(id)
            if(delProd) {
                replaceId(delProd)
                loggerController(`Se eliminó el producto con id ${id}`)
                return transformProductsToDTO(delProd)
            } else {
                loggerController(`No se encontró el producto con id ${id}`)
                return null
            }
        }
        catch(err) {
            loggerErrorController('Error al eliminar producto: ' + err)
        }
    }

    static createProducts(name, URL) {
        if(!instance) {
            instance = new ProductsDaoMongo(name, URL)
        }
        return instance
    }
}

export default ProductsDaoMongo