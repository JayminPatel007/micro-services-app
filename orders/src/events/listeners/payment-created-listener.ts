import {Listener, OrderStatus, PaymentCreatedEvent, Subjects} from "@jaymintickets/common";
import {Message} from "node-nats-streaming";

import {queueGroupName} from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

    async onMessage(data: PaymentCreatedEvent["data"], message: Message): Promise<void> {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            'status': OrderStatus.Complete
        });

        await order.save();


        message.ack();
    }

}
