import { db } from '../databases/firebase/db/firebaseConfig.js'
import {doc, getDocs, getDoc, addDoc, collection, updateDoc, deleteDoc, query, where} from 'firebase/firestore';
import {loggerErrorController, loggerController} from '../../controllers/loggerControllers.js'
import { transformProductsToDTO } from '../DTOs/productsDTO.js';

let instance = null;

class ProductsDaoFirebase {
    constructor(name){
        this.name = name;
    }

    async save(product) {
        try{
            const prodCollection = collection(db,'productos')
            const addedProdRef = await addDoc(prodCollection, product)
            const addedProd = await getDoc(addedProdRef)
            const addedProdData = addedProd.data()
            addedProdData.id = addedProdRef.id
            loggerController('Se guardó un nuevo producto')
            return transformProductsToDTO(addedProdData)
        }
        catch(err){
            loggerErrorController('Error al guardar nuevo producto ' + err)
        }
    }

    async getById(prodId) {
        try {
            const prodRef = doc(db,'productos', `${prodId}`)
            const prodSnap = await getDoc(prodRef)
            if (prodSnap.exists()){
                loggerController(`Se devuelve producto con id: ${prodId}`);
                const foundProd = {...prodSnap.data(), id: prodId}
                return transformProductsToDTO(foundProd)
            } else {
                loggerController(`No existe documento con id: ${prodId}`);
                return null
            }
        } catch(err){
            loggerErrorController('Error al buscar producto por id: ' + err)
        }
    }

    async getAll(categoria) {
        try{
            const prodCollection = collection(db,'productos')
            let categoriaLowercase, q
            if (categoria) {
                categoriaLowercase = categoria.toLowerCase()
                q = query(prodCollection, where('categoria', '==', `${categoriaLowercase}`));
            }
            const allProd = await getDocs(categoriaLowercase ? q : prodCollection)
            .then(result => {
                const lista = result.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                })
                return lista
            })
            loggerController('Se muestran todos los productos')
            return transformProductsToDTO(allProd)
        }
        catch(err){
            loggerErrorController('Error al buscar todos los productos: ' + err)
        }
    }

    async update(prodId, updProduct) {
        try{
            const prodToUpdate = await this.getById(prodId)
            const docRef = doc(db, "productos", `${prodId}`);
            if(prodToUpdate) {
                await updateDoc(docRef, {
                    ...updProduct
                });
                const updatedProd = await this.getById(prodId)
                loggerController(`Se actualizó el producto con id ${prodId}`)
                return transformProductsToDTO(updatedProd)
            } else {
                loggerController(`No se encontró el producto con id ${prodId}`)
            }
        }
        catch(err){
            loggerErrorController('Error al actualizar el producto: ' + err)
        }
    }

    async deleteById(prodId) {
        try{
            const prodToDelete = await this.getById(prodId)
            if(prodToDelete) {
                await deleteDoc(doc(db, "productos", `${prodId}`));
                loggerController(`Se eliminó el producto con id ${prodId}`)
                return transformProductsToDTO(prodToDelete)
            } else {
                loggerController(`No se encontró el producto con id ${prodId}`)
                return null
            }
        }
        catch(err){
            loggerErrorController('Error al eliminar producto: ' + err)
        }
    }

    static createProducts(name) {
        if(!instance) {
            instance = new ProductsDaoFirebase(name)
        }
        return instance
    }
}

export default ProductsDaoFirebase