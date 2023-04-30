import UsersRepo from '../Repos/usersRepo.js'
import CartsRepo from '../Repos/cartsRepo.js'
import path from 'path'
import {Strategy as LocalStrategy} from 'passport-local'
import dotenv from 'dotenv';
import {transporter} from '../config/nodemailerConfig.js'
import {loggerErrorController} from '../../controllers/loggerControllers.js'

dotenv.config()

const usersRepo = new UsersRepo()
const cartsRepo = new CartsRepo()

export const localRegisterStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const user = await usersRepo.findUser(email)
            if(user) {
                loggerErrorController('Ya existe un usuario registrado con ese nombre.')
                return done(null, false, { message: 'Ya existe un usuario registrado con ese nombre.'})
            }
            const newCartId = await cartsRepo.saveCart()
            const newUser = {email, password, nombre: req.body.nombre, direccion: req.body.direccion, edad: req.body.edad, telefono: req.body.telefono, avatar: path.join(`uploads`, req.file.filename), cartId: newCartId}
            await usersRepo.saveUser(newUser);
            const noPassUser = {...newUser};
            delete noPassUser.password;
            await transporter.sendMail(
                {
                    from: 'Ecommerce Coderhouse <no-reply@example.com>',
                    to: `<${process.env.MAIL_ADRESS}>`,
                    subject: 'Nuevo registro',
                    text: JSON.stringify(noPassUser)
                }
            )
            done(null, newUser)
        } catch (err) {
            done(err)
        }
})

export const localLoginStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, email, password, done) => {
    const user = await usersRepo.findUser(email)
    if(!user) {
        loggerErrorController('No existe un usuario registrado con ese nombre.')
        return done(null, false, { message: 'No existe un usuario registrado con ese nombre.'})
    }

    if(!usersRepo.isValidPassword(user, password)){
        loggerErrorController('Contraseña incorrecta.')
        return done(null, false, { message: 'Contraseña incorrecta.'})
    }

    return done(null, user)
})