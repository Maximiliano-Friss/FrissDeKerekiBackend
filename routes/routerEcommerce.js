import { Router } from 'express'
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config()
import { requireAuth } from '../services/config/passportConfig.js';
import {upload} from '../controllers/multerController.js'
import * as controller from '../controllers/ecommerceController.js'
import { sessionController } from '../controllers/sessionController.js';
import { passportConfig } from '../services/config/passportConfig.js';
passportConfig(passport)

const routerEcommerce = Router()
const sessionMiddleware = sessionController()

// MIDDLEWARES
routerEcommerce.use(sessionMiddleware)
routerEcommerce.use(passport.initialize())
routerEcommerce.use(passport.session())

//RUTAS
routerEcommerce.get('/', requireAuth, controller.getIndex)
routerEcommerce.post('/', controller.postIndex)
routerEcommerce.get('/profile', requireAuth, controller.getProfile)
routerEcommerce.get('/cart', requireAuth, controller.getCart)
routerEcommerce.get('/register', controller.getRegister) 
routerEcommerce.post('/register', upload.single('avatar'), passport.authenticate('register', {failureRedirect: '/api/ecommerce/register', failureFlash:true, successRedirect: '/api/ecommerce/'}), controller.postRegister)
routerEcommerce.get('/login', controller.getLogin)
routerEcommerce.post('/login', passport.authenticate('login', {failureRedirect: '/api/ecommerce/login', failureFlash:true, successRedirect: '/api/ecommerce/'}), controller.postLogin)
routerEcommerce.get('/logout', controller.getLogout)

//WEBSOCKETS
export default function(io) {
    controller.chat(io, routerEcommerce);
    controller.cart(io, routerEcommerce);
    return routerEcommerce;
}