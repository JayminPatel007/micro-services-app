import {OrderCancelledEvent, Publisher, Subjects} from "@jaymintickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
