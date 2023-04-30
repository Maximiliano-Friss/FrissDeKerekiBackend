export default class MessageModel {
    #id
    #author = { avatar: '', alias: '', edad: '', apellido: '', email: '', nombre: '' }
    #createdAt
    #mensaje

    constructor({ id, author, createdAt, mensaje }) {
        this.id = id;
        this.author = { avatar: author.avatar, alias: author.alias, edad: author.edad, apellido: author.apellido, email: author.email, nombre: author.nombre };
        this.createdAt = createdAt;
        this.mensaje = mensaje
    }

    get id() { return this.#id }
    set id(id) {this.#id = id}

    get author() { return this.#author }
    set author(author) {this.#author = author}

    get createdAt() { return this.#createdAt }
    set createdAt(createdAt) {this.#createdAt = createdAt}

    get mensaje() { return this.#mensaje }
    set mensaje(mensaje) {this.#mensaje = mensaje}

    datos() {
        return JSON.parse(JSON.stringify({
            id: this.#id,
            author: this.#author,
            createdAt: this.#createdAt,
            mensaje: this.#mensaje
        }))
    }

}
