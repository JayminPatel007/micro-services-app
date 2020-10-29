import request from 'supertest';
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@jaymintickets/common";

it('marks order as cancelled', async () => {
    const user = global.signup();
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
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

it.todo('emits an order cancelled event');
