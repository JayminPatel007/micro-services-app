import request from 'supertest';
import {app} from "../../app";
import {Order} from '../../models/order';
import {Ticket} from '../../models/ticket';
import {OrderStatus} from "@jaymintickets/common";
import { natsWrapper } from "../../nats-wrapper";

it('return an error if ticket does not exist', async () => {
    const ticketId = global.createMongooseId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ticketId})
        .expect(404);
});

it('returns an error if the ticket is already reserved!', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: global.createMongooseId()
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: 'hbjjkhhuk',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId: ticket.id
        })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: global.createMongooseId()
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId: ticket.id
        })
        .expect(201);
});

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: global.createMongooseId()
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
