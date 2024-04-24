

import { TicketEsquema } from "./models/ticket.model.js";

export class ticketMongoDao {

    async generaCode() {
        const lastTicket = await TicketEsquema.findOne().sort({ code: -1 });
        const nextTicketNumber = lastTicket ? parseInt(lastTicket.code.replace('TICKET-', '')) + 1 : 1;
        let nextTicketCode =nextTicketNumber.toString().padStart(8, '0');
        return `TICKET-${nextTicketCode}`;
    }

    async creaTicket(purchaserEmail, totalAmount) {
        const ticketCode = await this.generaCode();
        const ticket = new TicketEsquema({
            code: ticketCode,
            purchaser: purchaserEmail,
            purchase_datetime: new Date(),
            amount: totalAmount
        });
        await ticket.save();
        return ticket;
    }
}