import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config()

const accountSid = process.env.TWILIO_SID; 
const authToken = process.env.TWILIO_AUTH; 
const client = twilio(accountSid, authToken)

async function twilioSMS(){
    return await client.messages.create({
        body: 'Tu pedido ha sido recibido y ya se encuentra en proceso',
        from: process.env.TWILIO_PHONE,
        to: process.env.ADMIN_PHONE // Aquí iría to: loggedUser.phone, pero no lo permite dado que estoy usando una cuenta trial en Twilio.
    })
}

async function twilioWhatsapp(user){
    return await client.messages.create({
        body: `Nuevo pedido de ${user.nombre} - ${user.email}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
        to: `whatsapp:${process.env.ADMIN_PHONE}`,
    })
}

export {twilioSMS, twilioWhatsapp}