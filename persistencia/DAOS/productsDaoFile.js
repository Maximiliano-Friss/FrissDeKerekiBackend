import fs from 'fs';
import {loggerController, loggerErrorController} from '../../controllers/loggerControllers.js';
import { transformProductsToDTO } from '../DTOs/productsDTO.js';

let instance = null;

class ProductsDaoFile {
    constructor(name){
        this.name = name;
    }

    async save(product) {
        try {
            let dataToSave = [];
            
            if (fs.existsSync('./persistencia/databases/files/products.txt')) {
                const currentData = await fs.promises.readFile('./persistencia/databases/files/products.txt', 'utf-8');
                if (currentData !== '') {
                    dataToSave = JSON.parse(currentData);
                }
            }
            product.id = this.randomId(10);
            dataToSave.push(product);
            await fs.promises.writeFile('./persistencia/databases/files/products.txt', JSON.stringify(dataToSave, null, 2));
            loggerController('Se guardó un nuevo producto')
            return transformProductsToDTO(product)
        }
        catch(err){
            loggerErrorController(err)
        }
    }

    async getById(id) {
        try {
            const currentData = await fs.promises.readFile('./persistencia/databases/files/products.txt', 'utf-8');
            const currentDataJSON = JSON.parse(currentData);
            const singleProduct = currentDataJSON.find(element => element.id == id)
            if (singleProduct){
                loggerController(`Se devuelvo producto con id: ${id}`)
                return transformProductsToDTO(singleProduct)
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
        try {
            const currentData = await fs.promises.readFile('./persistencia/databases/files/products.txt', 'utf-8');
            const currentDataJSON = JSON.parse(currentData);
            loggerController('Se buscan todos los productos')
            if (categoria) {
                const categoriaLowercase = categoria.toLowerCase()
                const filteredProducts = currentDataJSON.filter(element => element.categoria === categoriaLowercase)
                return transformProductsToDTO(filteredProducts);
            } else {
                return transformProductsToDTO(currentDataJSON);
            }
        }
        catch(err){
            loggerErrorController('Error al buscar todos los productos: ' + err)
        }
    }

    async update(id, updProduct) {
        try{
            const currentData = await fs.promises.readFile('./persistencia/databases/files/products.txt', 'utf-8');
            const currentDataJSON = JSON.parse(currentData);
            const index = currentDataJSON.findIndex((product) => product.id == id)
            if(index !== -1) {
                const updatedProduct = {...currentDataJSON[index], ...updProduct};
                currentDataJSON[index] = updatedProduct;
                await fs.promises.writeFile('./persistencia/databases/files/products.txt', JSON.stringify(currentDataJSON, null, 2));
                loggerController(`Se actualizó el producto con id ${id}`)
                return transformProductsToDTO(updatedProduct);
            } else {
                loggerController(`No se encontró el producto con id ${id}`)
            }
        }
        catch(err) {
            loggerErrorController('Error al actualizar el producto: ' + err)
        }
    }

    async deleteById(id) {
        try {
            const currentData = await fs.promises.readFile('./persistencia/databases/files/products.txt', 'utf-8');
            const currentDataJSON = JSON.parse(currentData);
            const productToDelete = currentDataJSON.find(element => element.id == id)
            const index = currentDataJSON.findIndex((product) => product.id == id)
            if(index !== -1) {
                const newCurrentDataJSON = currentDataJSON.filter(element => element.id != id);
                await fs.promises.writeFile('./persistencia/databases/files/products.txt', JSON.stringify(newCurrentDataJSON, null, 2));
                loggerController(`Se eliminó el producto con id ${id}`)
                return productToDelete
            } else {
                loggerController(`No se encontró el producto con id ${id}`)
                return null
            }
        }
        catch(err) {
            loggerErrorController('Error al eliminar producto: ' + err)
        }
    }

    randomId(idLength){
        let randomString = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
        for(let i = 0; i < idLength; i++){
            randomString += characters.charAt(Math.floor(Math.random()*characters.length))
        }
        return randomString
    }

    static createProducts(name) {
        if(!instance) {
            instance = new ProductsDaoFile(name)
        }
        return instance
    }
}

export default ProductsDaoFile