import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASS
    }
})

async function nodemailerEmail(user, productsInCart) {
    const emailInfo = {
        from: 'Ecommerce Coderhouse <no-reply@example.com>',
        to: `<${process.env.MAIL_ADDRESS}>`,
        subject: `Nuevo pedido de ${user.nombre} - ${user.email}`,
        html: `
        <h2>Orden realizada por ${user.nombre} - ${user.email}</h2>
        ${productsInCart.map( p => {
            return `<p>${p.nombre} - ${p.precio} - ${p.cantidad} unidad/es</p>`
        })}`
    }
    return emailInfo
}

export {transporter, nodemailerEmail}