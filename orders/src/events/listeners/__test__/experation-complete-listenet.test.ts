import {natsWrapper} from "../../../nats-wrapper";
import {ExperationCompletedListener} from "../experation-completed-listener";
import {Order} from "../../../models/order";
import {Ticket} from "../../../models/ticket";
import {ExperationCompleteEvent, OrderStatus} from "@jaymintickets/common";
import {Message} from 'node-nats-streaming';

const setUp = async () => {
    const listener = new ExperationCompletedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: global.createMongooseId(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'lkbkjh',
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    const data: ExperationCompleteEvent['data'] = {
        orderId: order.id
    };

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, order, data, message };
};

it('updates the order status to cancel', async () => {
    const { listener, ticket, order, data, message } = await setUp();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.orderId);
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('emits an OrderCancelled event', async () => {
    const { listener, ticket, order, data, message } = await setUp();

    await listener.onMessage(data, message);

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, ticket, order, data, message } = await setUp();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

