import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@jaymintickets/common";
import {Message} from "node-nats-streaming";
import retryTimes = jest.retryTimes;

const setUp = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'F1',
        price: 499,
        userId: 'abc'
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        expiresAt: "abc",
        id: global.createMongooseId(),
        status: OrderStatus.Created,
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        userId: "abc",
        version: 0
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, listener, data, ticket }
};

it('sets the orderId of the ticket', async () => {
    const { msg, listener, data, ticket } = await setUp();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('calls the ack message', async () => {
    const { msg, listener, data, ticket } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { msg, listener, data, ticket } = await setUp();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

});
