import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {OrderCreatedEvent, OrderStatus} from "@jaymintickets/common";
import { Message } from 'node-nats-streaming';
import {Order} from "../../../models/order";

const setUp = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: global.createMongooseId(),
        version: 0,
        expiresAt: 'jhbh',
        userId: 'jhbih',
        status: OrderStatus.Created,
        ticket: {
            id: 'ljkbhb',
            price: 10
        }
    };

    // @ts-ignore
    const msg : Message = {
        ack: jest.fn()
    };

    return { msg, data, listener }
};

it('replicates order info', async () => {
    const { msg, data, listener } = await setUp();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
    expect(order!.id).toEqual(data.id);
});

it('acks the message', async () => {
    const { msg, data, listener } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
