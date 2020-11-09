import {PaymentCreatedEvent, Publisher, Subjects} from "@jaymintickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
