import {Listener, Subjects, TicketCreatedEvent} from "@jaymintickets/common";
import {Message} from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    async onMessage(data: TicketCreatedEvent["data"], message: Message) {
        const { id ,title, price, version } = data;

        const ticket = Ticket.build({
            title, price, id
        });

        await ticket.save();

        message.ack();
    }
}
