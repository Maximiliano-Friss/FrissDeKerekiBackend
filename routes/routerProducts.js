import { Router } from 'express'
import dotenv from 'dotenv';
import productsController from '../controllers/productsController.js';
dotenv.config()

const router = Router()

export default class routerProducts {
    constructor(){
        this.productsController = new productsController()
    }

    start(){
        router.get('/', this.productsController.getProducts)
        router.get('/:id', this.productsController.getProductById)
        router.post('/', this.productsController.postProduct)
        router.put('/:id', this.productsController.updateProduct)
        router.delete('/:id', this.productsController.deleteProductById)
        return router
    }
}
