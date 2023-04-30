import mongoose from "mongoose";
import bcrypt from 'bcrypt'

//PRODUCTOS

const productosCollection = 'productos';

const ProductoSchema = new mongoose.Schema({
    nombre: {type: String, required: true, max: 100},
    precio: {type: Number, required: true},
    foto: {type: String, required: true},
    categoria: {type: String, required: true},
    descripcion: {type: String, required: true},
    cantidad: {type: Number}
}, {timestamps: true})

export const productos = mongoose.model(productosCollection, ProductoSchema)

//USUARIOS

const usuariosCollection = 'usuarios';

const UsuarioSchema = new mongoose.Schema({
    email: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true},
    nombre: {type: String, required: true, maxLength: 200},
    direccion: {type: String, required: true, maxLength: 200},
    edad: {type: Number, required: true, minimum: 18, maximum: 100},
    telefono: {type: String, required: true},
    avatar: {type: String, required: true},
    cartId: {type: String},
}, {timestamps: true})

UsuarioSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
});

export const usuarios = mongoose.model(usuariosCollection, UsuarioSchema)

//CARRITOS

const carritosCollection = 'carritos';

const CarritoSchema = new mongoose.Schema({
    productos: {type: Array}
}, {timestamps: true})

export const carritos = mongoose.model(carritosCollection, CarritoSchema)