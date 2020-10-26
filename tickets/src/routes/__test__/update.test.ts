import request from 'supertest';
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if provided id does not exist', async () => {
    const id = global.createMongooseId();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'test',
            price: 20,
        })
        .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
    const id = global.createMongooseId();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test',
            price: 20,
        })
        .expect(401);
});

it('returns a 401 is user doesn\'t own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'test',
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'test2',
            price: 21,
        })
        .expect(401);
});

it('returns a 400 if user provides an invalid title or price', async () => {
    const cookie = global.signup();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 21,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            price: 21,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test2',
            price: -1,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test2',
            price: 0,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test2',
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signup();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test2',
            price: 21
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send({});

    expect(ticketResponse.body.title).toEqual('test2');
    expect(ticketResponse.body.price).toEqual(21);
});

it('publishes an event', async () => {
    const cookie = global.signup();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test2',
            price: 21
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

