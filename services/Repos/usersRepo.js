import UserModel from '../../persistence/models/userModel.js';
import UsersDaoMongo from '../../persistence/DAOS/usersDaoMongo.js';

export default class UsersRepo {
    dao

    constructor() {
        this.dao = UsersDaoMongo.createUsers('users');
    }
        
    async saveUser(user) {
        return await this.dao.save(user)
    }

    async findUser(email) {
        const foundUser = await this.dao.findUser(email)
        return foundUser ? new UserModel(foundUser).datos() : undefined
    }

    isValidPassword(user, password) {
        return this.dao.isValidPassword(user, password)
    }
}
