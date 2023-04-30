import ProductsDaoMongo from "../DAOS/productsDaoMongo.js";
import ProductsDaoFile from "../DAOS/productsDaoFile.js";
import ProductsDaoFirebase from "../DAOS/productsDaoFirebase.js";
import {URL} from "../databases/mongo/mongoConfig.js";

let products
const environmentDB = process.env.NODE_ENV || 'PROD_MONGO'

switch (environmentDB) {
    case 'PROD_MONGO':
        products = await ProductsDaoMongo.createProducts('Products', URL)
        break;
    case 'PROD_FIREBASE':
        products = await ProductsDaoFirebase.createProducts('Products')
        break;
    default:
        products = await ProductsDaoFile.createProducts('Products')
}

class ProductsFactory {
    static getProducts() {
        return products
    }
}

export default ProductsFactory