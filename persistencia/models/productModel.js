export default class ProductModel {
    #id
    #nombre
    #precio
    #foto
    #categoria
    #descripcion
    #cantidad

    constructor({id, nombre, precio, foto, categoria, descripcion, cantidad = 1}) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.foto = foto
        this.categoria = categoria
        this.descripcion = descripcion
        this.cantidad = cantidad
    }

    get id() { return this.#id }
    set id(id) {this.#id = id}

    get nombre() { return this.#nombre }
    set nombre(nombre) {this.#nombre = nombre}

    get precio() { return this.#precio }
    set precio(precio) {this.#precio = precio}

    get foto() { return this.#foto }
    set foto(foto) {this.#foto = foto}

    get categoria() { return this.#categoria }
    set categoria(categoria) {this.#categoria = categoria}

    get descripcion() { return this.#descripcion }
    set descripcion(descripcion) {this.#descripcion = descripcion}

    get cantidad() { return this.#cantidad }
    set cantidad(cantidad) {this.#cantidad = cantidad}
    
    datos() {
        return JSON.parse(JSON.stringify({
            id: this.#id,
            nombre: this.#nombre,
            precio: this.#precio,
            foto: this.#foto,
            categoria: this.#categoria,
            descripcion: this.#descripcion,
            cantidad: this.#cantidad
        }))
    }
}