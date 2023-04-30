import MessageModel from '../../persistencia/models/messageModel.js';
import MessagesDaoFirebase from '../../persistencia/DAOS/messagesDaoFirebase.js'

export default class MessagesRepo {
    dao

    constructor() {
        this.dao = MessagesDaoFirebase.createMessages('messages')
    }
        
    async saveMsg(msg) {
        await this.dao.save(msg)
    }

    async getAllMessages() {
        const messages = await this.dao.getAll()
        return messages.map(m => new MessageModel(m).datos());
    }
}