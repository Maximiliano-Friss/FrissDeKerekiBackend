import MessagesRepo from '../services/Repos/messagesRepo.js'
import ProductsRepo from '../services/Repos/productsRepo.js'
import UsersRepo from '../services/Repos/usersRepo.js'
import CartsRepo from '../services/Repos/cartsRepo.js'
import {normalize} from 'normalizr'
import {schemaMessages} from '../services/config/normalizrConfig.js'
import {nodemailerEmail, transporter} from '../services/config/nodemailerConfig.js'
import {twilioSMS, twilioWhatsapp} from '../services/config/twilioConfig.js'
import {loggerController, loggerErrorController, loggerReqController} from './loggerControllers.js'
import dotenv from 'dotenv';
dotenv.config()

//REPOSITORIOS
const productsRepo = new ProductsRepo()
const messagesRepo = new MessagesRepo()
const usersRepo = new UsersRepo()
const cartsRepo = new CartsRepo()

//SCRIPTS
const indexScript = '/js/index.js'
const logoutScript = '/js/logout.js'
const cartScript = '/js/cart.js'
const cartRemoveScript = '/js/cartRemove.js'
const registerScript = '/js/register.js'

//CONTROLLERS
export async function getRegister(req, res) {
    loggerReqController(req, 'info')
    res.render('register', {script: registerScript, messages: req.flash('error')})
}

export async function postRegister(req, res) {
    loggerReqController(req, 'info')
}

export async function getLogin(req, res) {
    loggerReqController(req, 'info')
    if (req.isAuthenticated()) {
        res.render('/')
    }
    res.render('login', { messages: req.flash('error') })
}

export async function getIndex(req, res) {
    loggerReqController(req, 'info')
    const userEmail = req.user.email
    const products = await productsRepo.getAllProducts()
    res.render('main', {user: userEmail, script: indexScript, products: products})
}

export async function postIndex(req, res) {
    loggerReqController(req, 'info')
    const loggedUser = await usersRepo.findUser(req.user.email)
    const cartId = loggedUser.cartId;
    const productId = req.body.item;
    const product = await productsRepo.getProductById(productId)
    await cartsRepo.saveProductToCart(cartId, product)
}

export async function getProfile(req, res) {
    loggerReqController(req, 'info')
    const loggedUser = await usersRepo.findUser(req.user.email)
    const url = req.get('host')
    const user = {
        email: loggedUser.email,
        nombre: loggedUser.nombre,
        direccion: loggedUser.direccion,
        edad: loggedUser.edad,
        telefono: loggedUser.telefono,
        avatar: loggedUser.avatar,
    }
    res.render('profile', {...user, url: url})
}

export async function getCart(req, res) {
    loggerReqController(req, 'info')
    res.render('cart', {script: cartScript, userEmail: req.user.email})
}

export async function postRemoveFromCart(req,res) {
    loggerReqController(req, 'info')
    const loggedUser = await usersRepo.findUser(req.user.email)
    const cartId = loggedUser.cartId;
    const productId = req.body.item;
    const product = await productsRepo.getProductById(productId)
    await cartsRepo.deleteProdById(cartId, product)
    res.render('cart', {script: cartRemoveScript})
}

export async function postLogin(req, res) {
    loggerReqController(req, 'info')
}

export async function getLogout(req, res, next) {
    loggerReqController(req, 'info')
    const userEmail = req.user.email
    req.logout(function(err) {
        req.session = null;
        if (err) {return next(err)}
        res.render('logout', {user: userEmail, script: logoutScript});
    });
}

//WEBSOCKETS CHAT & CART
export function chat(io) {
    return io.on('connection', async (socket) => {
        try{
            const messages = await messagesRepo.getAllMessages();
            const stringifyMessages = JSON.stringify(messages);
            const parsedMessages = JSON.parse(stringifyMessages);
            const normMessages = normalize(parsedMessages, schemaMessages)
            io.sockets.emit('totalMessages', normMessages);
        } catch {
            loggerErrorController("Hubo un problema al mostrar los mensajes.")
        }

        socket.on('newMessage', async (data) => {
            try{
                await messagesRepo.saveMsg(data);
                const messages = await messagesRepo.getAllMessages();
                const normMessages = normalize(messages, schemaMessages)
                io.sockets.emit('totalMessages', normMessages)
            } catch(error) {
                loggerErrorController(`${error}: Hubo un problema al agregar un mensaje nuevo al chat.`)
            }
        })
    })
};

export function cart(io) {
    return io.on('connection', async (socket) => {
        let userEmail
        socket.on('userEmail', async (message) => {
            userEmail = message;
            try{
                const loggedUser = await usersRepo.findUser(userEmail)
                const productsInCart = await cartsRepo.getCartById(loggedUser.cartId)
                io.sockets.emit('productsInCart', productsInCart);
            } catch {
                loggerErrorController("Hubo un problema al mostrar los productos en el carrito.")
            }
        })

        socket.on('removedProduct', async (prodId) => {
            try{
                const loggedUser = await usersRepo.findUser(userEmail)
                const removedProduct = await productsRepo.getProductById(prodId)
                await cartsRepo.deleteProdById(loggedUser.cartId, removedProduct)
                const productsInCart = await cartsRepo.getCartById(loggedUser.cartId)
                io.sockets.emit('productsInCart', productsInCart)
            } catch(error) {
                loggerErrorController(`${error}: Hubo un problema al eliminar un producto del carrito.`)
            }
        })

        socket.on('newOrder', async () => {
            const loggedUser = await usersRepo.findUser(userEmail)
            const productsInCart = await cartsRepo.getCartById(loggedUser.cartId)
            try{
                //USER - TWILIO SMS
                try {
                const message = await twilioSMS()
                loggerController(`SMS Twilio: ${JSON.stringify(message)}`)
                } catch (error) {
                    loggerErrorController(`${error}: something went wrong sending Twilio's SMS message`)
                }
            
                //ADMIN - NODEMAILER
                try {
                    const message = await nodemailerEmail(loggedUser, productsInCart)
                    await transporter.sendMail(message)
                    loggerController(`Nodemailer: ${JSON.stringify(message)}`)
                } catch (error) {
                    loggerErrorController(`${error}: something went wrong sending Nodemailers's email`)
                }

                //ADMIN - TWILIO WHATSAPP
                try {
                    const message = await twilioWhatsapp(loggedUser)
                    loggerController(`Whatsapp Twilio: ${JSON.stringify(message)}`)
                } catch (error) {
                    loggerErrorController(`${error}: something went wrong sending Twilio's Whatsapp message`)
                }
            } finally {
                await cartsRepo.emptyCartById(loggedUser.cartId)
                io.sockets.emit('emptyCart')
            }
        })
    })
}
