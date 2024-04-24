

import twilio from 'twilio'
const accountSid = 'AC965780b90e0c69d37f015e77c78c4194';
const authToken = '88492482a57da867798ec8821c662306';

const client=twilio(accountSid, authToken)

export const enviarWs= (mensaje)=>{
    return client.messages
    .create({
        body: mensaje,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+5493515213287'
    })

}