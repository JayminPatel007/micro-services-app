import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return 404 if the ticket is not found', async () => {
    const id = global.createMongooseId();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('returns a ticket if ticket is found', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'test',
            price: 20
        })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual('test');
    expect(ticketResponse.body.price).toEqual(20);
});
