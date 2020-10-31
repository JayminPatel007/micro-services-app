import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@jaymintickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const id = global.createMongooseId();
    const userId = global.createMongooseId();
    const ticket = Ticket.build({
        id: id,
        title: 'concert',
        price: 20
    });

    await ticket.save();
    const data: TicketUpdatedEvent['data'] = {
        id: id,
        version: ticket.version + 1,
        title: 'F1',
        price: 499,
        userId: userId
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('finds, updates and saves the ticket', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if an event has skipped version number', async () => {
    const { msg, data, listener } = await setup();

    data.version = 10;
    
    try {
        await listener.onMessage(data, msg);
    } catch (err) {
        
    }
    expect(msg.ack).not.toHaveBeenCalled();
});
