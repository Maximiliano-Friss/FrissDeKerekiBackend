export default class UsersDTO {
    constructor({ id, email, password, nombre, direccion, edad, telefono, avatar, cartId}) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.direccion = direccion;
        this.edad = edad;
        this.telefono = telefono;
        this.avatar = avatar;
        this.cartId = cartId;
    }
}

export function transformUsersToDTO(users) {
    if (Array.isArray(users)) {
        return users.map(u => new UsersDTO(u))
    } else {
        return new UsersDTO(users)
    }
}