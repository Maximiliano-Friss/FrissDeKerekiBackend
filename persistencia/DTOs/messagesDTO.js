export default class MessagesDTO {
    constructor({ id, author, createdAt, mensaje }) {
        this.id = id;
        this.author = author;
        this.createdAt = createdAt;
        this.mensaje = mensaje
    }
}

export function transformMessagesToDTO(mensajes) {
    if (Array.isArray(mensajes)) {
        return mensajes.map(m => new MessagesDTO(m))
    } else {
        return new MessagesDTO(mensajes)
    }
}