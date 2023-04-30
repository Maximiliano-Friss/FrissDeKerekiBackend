class ProductsDTO {
    constructor({ id, nombre, precio, foto, categoria, descripcion, cantidad}) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
        this.categoria = categoria;
        this.descripcion = descripcion
        this.cantidad = cantidad
    }
}

export function transformProductsToDTO(productos) {
    if (Array.isArray(productos)) {
        return productos.map(p => new ProductsDTO(p))
    } else {
        return new ProductsDTO(productos)
    }
}