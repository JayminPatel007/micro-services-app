import request from 'supertest';
import {app} from '../../app';
import {Order} from "../../models/order";
import {OrderStatus} from "@jaymintickets/common";
import {stripe} from "../../stripe";
import {Payment} from "../../models/payment";

jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup())
        .send({
            token: 'kjlbhb',
            orderId: global.createMongooseId()
        }).expect(404);
});

it('returns a 401 when purchasing an order that doesn\'t belong to the user', async () => {
    const order = Order.build({
        id: global.createMongooseId(),
        userId: global.createMongooseId(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup())
        .send({
            token: 'kjlbhb',
            orderId: order.id
        }).expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const token = global.createMongooseId();
    const order = Order.build({
        id: global.createMongooseId(),
        userId: token,
        version: 0,
        price: 20,
        status: OrderStatus.Canceled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup(token))
        .send({
            token: 'kjlbhb',
            orderId: order.id
        }).expect(400);
});

it('returns 201 with valid inputs', async () => {
    const token = global.createMongooseId();
    const order = Order.build({
        id: global.createMongooseId(),
        userId: token,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup(token))
        .send({
            token: 'tok_visa',
            orderId: order.id
        }).expect(201);


    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(order.price * 100);
    expect(chargeOptions.currency).toEqual('inr');
});
