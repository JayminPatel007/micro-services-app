import {Listener, OrderCreatedEvent, Subjects} from "@jaymintickets/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from './queue-group-name';
import { experationQueue } from "../../queues/experation-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent["data"], message: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await experationQueue.add({
            orderId: data.id
        }, {
            delay
        }
        );
        message.ack();
    }

}
