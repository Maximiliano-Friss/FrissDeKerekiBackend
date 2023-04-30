import dotenv from 'dotenv';
import UsersRepo from '../Repos/usersRepo.js';
import { localLoginStrategy, localRegisterStrategy } from '../passportStrategies/local.js';
dotenv.config()

const usersRepo = new UsersRepo()

export const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/api/ecommerce/login')
    }
}

export async function passportConfig(passport){
    passport.serializeUser((user, done) => {
        done(null, user.email)
    })
    
    passport.deserializeUser( async (email, done) => {
        const user = await usersRepo.findUser(email)
        done(null, user)
    })

    passport.use('register', localRegisterStrategy)
    passport.use('login', localLoginStrategy)
}