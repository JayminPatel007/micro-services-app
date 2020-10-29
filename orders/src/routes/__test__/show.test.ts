import request from 'supertest';
import { app } from '../../app';
import { Ticket } from "../../models/ticket";

it('fetches a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders/')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    const { body: fetchedOrder } =await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send({})
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one usr tries to fetch order of other user', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signup();

    const { body } = await request(app)
        .post('/api/orders/')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    await request(app)
        .get(`/api/orders/${body.id}`)
        .set('Cookie', global.signup())
        .send({})
        .expect(401);
});