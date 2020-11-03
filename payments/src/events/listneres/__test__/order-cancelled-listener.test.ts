import {OrderCancelledListener} from "../order-cancelled-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Order} from "../../../models/order";
import {OrderCancelledEvent, OrderStatus} from "@jaymintickets/common";
import {Message} from "node-nats-streaming";


const setUp = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = await Order.build({
        id: global.createMongooseId(),
        userId: 'hbjkhb',
        version: 0,
        price: 10,
        status: OrderStatus.Created
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'kjvkv'
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, msg }
};

it('updates the status of the order', async () => {
    const { listener, order, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('acks the message', async () => {
    const { listener, order, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
