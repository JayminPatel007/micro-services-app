import {OrderCreatedEvent, Publisher, Subjects} from "@jaymintickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
