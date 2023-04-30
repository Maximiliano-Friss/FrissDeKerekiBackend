import { db } from '../databases/firebase/db/firebaseConfig.js'
import {doc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import {loggerErrorController} from '../../controllers/loggerControllers.js'
import { transformMessagesToDTO } from '../DTOs/messagesDTO.js';

let instance = null;

class MessagesDaoFirebase {
    constructor(name){
        this.name = name;
    }

    async save(msg) {
        try{
            const msgCollection = doc(db, "mensajes", "grupoMsg");
            const allMsg = await this.getAll()
            msg.id = allMsg.length + 1
            await updateDoc(msgCollection, {
                mensajes: arrayUnion(msg)
            });
        }
        catch(err){
            loggerErrorController(`${err}: Error al ejecutar save() en DAO de mensajes`)
        }
    }

    async getAll() {
        try{
            const docRef = doc(db,'mensajes', 'grupoMsg')
            const allMsg = await getDoc(docRef)
            .then(doc => {
                return {
                    ...doc.data(),
                }
            })
            return transformMessagesToDTO(allMsg.mensajes)
        }
        catch(err){
            loggerErrorController(`${err}: Error al ejecutar getAll() en DAO de mensajes`)
        }
    }

    static createMessages(name) {
        if(!instance) {
            instance = new MessagesDaoFirebase(name)
        }
        return instance
    }
}

export default MessagesDaoFirebase