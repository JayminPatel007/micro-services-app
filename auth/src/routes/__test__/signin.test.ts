import request from 'supertest';
import { app } from '../../app';

it('returns a 400 with an email or password is not provided', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            password: 'password'
        })
        .expect(400);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com'
        })
        .expect(400);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'alskdflaskjfd',
            password: 'password'
        })
        .expect(400);
});

it('fails when a email does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(400);
});

it('fails when an incorrect password is provided', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password2'
        }).expect(400);
});

it('responds with cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});
