import {ExperationCompleteEvent, Listener, Subjects, OrderStatus} from "@jaymintickets/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";
import {OrderCancelledPublisher} from "../publishers/order-cancelled-publisher";

export class ExperationCompletedListener extends Listener<ExperationCompleteEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.ExperationComplete = Subjects.ExperationComplete;

    async onMessage(data: ExperationCompleteEvent["data"], message: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Canceled
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        message.ack();
    }

}
