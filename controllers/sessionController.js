import MongoStore from 'connect-mongo';
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
import {URL} from '../persistence/databases/mongo/mongoConfig.js'
import session from 'express-session';

export function sessionController() {
    return session({
        store: MongoStore.create({mongoUrl: URL, mongoOptions: advancedOptions}),
        secret: process.env.MONGO_STORE_SECRET,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        unset: 'destroy',
        cookie: {
            maxAge: 1000*60*10
        }
    })
}