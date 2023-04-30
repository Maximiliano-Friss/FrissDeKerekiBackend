import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import * as models from '../databases/mongo/models/models.js'
import {URL, replaceId} from '../databases/mongo/mongoConfig.js'
import {loggerController, loggerErrorController} from '../../controllers/loggerControllers.js'
import {transformUsersToDTO} from '../DTOs/usersDTO.js';

let instance = null;

class UsersDaoMongo {
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

    async save(user) {
        try{
            const newUser = await models.usuarios(user).save()
            replaceId(newUser)
            loggerController('Se registró un nuevo usuario')
            return transformUsersToDTO(newUser)
        }
        catch(err){
            loggerErrorController(err)
        }
    }

    async findUser(email) {
        try{
            const user = await models.usuarios.findOne({email:email}).maxTimeMS(30000)
            replaceId(user)
            return user ? transformUsersToDTO(user) : undefined
        }
        catch(err){
            loggerErrorController('Error en findUser')
        }
    }

    isValidPassword(user, password) {
        return bcrypt.compareSync(password, user.password)
    }

    static createUsers(name) {
        if(!instance) {
            instance = new UsersDaoMongo(name)
        }

        return instance
    }
}

export default UsersDaoMongo