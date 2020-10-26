import {Publisher, Subjects, TicketCreatedEvent} from '@jaymintickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
