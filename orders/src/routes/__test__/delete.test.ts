import request from 'supertest';
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@jaymintickets/common";
import { natsWrapper } from "../../nats-wrapper";

it('marks order as cancelled', async () => {
    const user = global.signup();
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: global.createMongooseId()
    });

    await ticket.save();

    const { body: order }  = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send({})
        .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('emits an order cancelled event', async () => {
    const user = global.signup();
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: global.createMongooseId()
    });

    await ticket.save();

    const { body: order }  = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send({})
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
