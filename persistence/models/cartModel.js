export default class CartModel {
    #id
    #productos

    constructor({id, productos}) {
        this.id = id
        this.productos = productos
    }

    get id() { return this.#id }
    set id(id) {this.#id = id}

    get productos() { return this.#productos }
    set productos(productos) {this.#productos = productos}

    datos() {
        return JSON.parse(JSON.stringify({
            id: this.#id,
            productos: this.#productos,
        }))
    }
}