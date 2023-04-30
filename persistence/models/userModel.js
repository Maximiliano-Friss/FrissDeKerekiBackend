export default class UserModel {
    #id
    #nombre
    #password
    #email
    #direccion
    #edad
    #telefono
    #avatar
    #cartId

    constructor({id = null, nombre, password, email, direccion, edad, telefono, avatar, cartId = null}) {
        this.id = id
        this.nombre = nombre
        this.password = password
        this.email = email
        this.direccion = direccion
        this.edad = edad
        this.telefono = telefono
        this.avatar = avatar
        this.cartId = cartId
    }

    get id() { return this.#id }
    set id(id) {this.#id = id}

    get nombre() { return this.#nombre }
    set nombre(nombre) {this.#nombre = nombre}

    get password() { return this.#password }
    set password(password) {this.#password = password}

    get email() { return this.#email }
    set email(email) {this.#email = email}
    
    get direccion() { return this.#direccion }
    set direccion(direccion) {this.#direccion = direccion}
    
    get edad() { return this.#edad }
    set edad(edad) {this.#edad = edad}
    
    get telefono() { return this.#telefono }
    set telefono(telefono) {this.#telefono = telefono}
    
    get avatar() { return this.#avatar }
    set avatar(avatar) {this.#avatar = avatar}
    
    get cartId() { return this.#cartId }
    set cartId(cartId) {this.#cartId = cartId}
    
    datos() {
        return JSON.parse(JSON.stringify({
            id: this.#id,
            nombre: this.#nombre,
            password: this.#password,
            email: this.#email,
            direccion: this.#direccion,
            edad: this.#edad,
            telefono: this.#telefono,
            avatar: this.#avatar,
            cartId: this.#cartId
        }))
    }
}