import { Listener, OrderCreatedEvent, Subjects } from "@jaymintickets/common";
import { queueGroupName } from "./que-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent["data"], message: Message): Promise<void> {
         const ticket = await Ticket.findById(data.ticket.id);

         if (!ticket) {
             throw new Error('Ticket not found');
         }

         ticket.set({orderId: data.id});

         await ticket.save();

         await new TicketUpdatedPublisher(this.client).publish({
             id: ticket.id,
             price: ticket.price,
             title: ticket.title,
             orderId: ticket.orderId,
             version: ticket.version,
             userId: ticket.userId
         });
         message.ack();
    }
}
