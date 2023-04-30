import ProductsRepo from '../services/Repos/productsRepo.js';
import {loggerReqController} from './loggerControllers.js'
import dotenv from 'dotenv';
dotenv.config()


//CONTROLLERS
export default class productsController {

    constructor(){
        this.serviceProducts = new ProductsRepo()
    }

    getProducts = async (req, res) => {
        loggerReqController(req, 'info')
        const categoria = req.query.categoria || undefined
        const products = await this.serviceProducts.getAllProducts(categoria)
        res.json(products)
    }

    getProductById = async (req, res) => {
        loggerReqController(req, 'info')
        const product = await this.serviceProducts.getProductById(req.params.id)
        if(product){
            res.json(product)
        } else {
            res.json(`No se encontró el producto con id ${req.params.id}`)
        }
    }

    postProduct = async (req, res) => {
        loggerReqController(req, 'info')
        const newProduct = await this.serviceProducts.saveProduct(req.body)
        res.json(newProduct)
    }

    updateProduct = async (req, res) => {
        loggerReqController(req, 'info')
        const updatedProduct = await this.serviceProducts.updateProduct(req.params.id, req.body);
        if (updatedProduct){
            res.json(updatedProduct);
        } else {
            res.json({error:`No se encontró el producto con id ${req.params.id}`})
        }
    }
    
    deleteProductById = async (req, res) => {
        loggerReqController(req, 'info')
        const deletedProd = await this.serviceProducts.deleteProductById(req.params.id)
        if (deletedProd) {
            res.json({eliminado: deletedProd.nombre});
        } else {
            res.json({error:`No se encontró el producto con id ${req.params.id}`})
        }
    }
}