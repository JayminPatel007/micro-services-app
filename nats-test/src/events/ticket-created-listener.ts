import {Message} from "node-nats-streaming";
import {Listener} from "./base-listener";
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    queueGroupName = 'payments-service';
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    onMessage(data: TicketCreatedEvent['data'], message: Message): void {
        console.log(`${message.getSequence()} Event data ${data}`);
        console.log(data);
        message.ack();
    }

}
