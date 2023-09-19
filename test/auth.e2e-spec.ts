import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as ExpressSession from 'express-session';
import * as passport from 'passport';
import "reflect-metadata";
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { Session } from '../utils/typeorm/entities/Session';

describe('AuthController (e2e)', () => { 
    let app: INestApplication;

    // Set up Nest environment and start server
    beforeAll(async () => {
        const { PORT, COOKIE_SECRET, SESSION_NAME, COOKIE_MAX_AGE } = process.env;
        
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        const sessionRepo = app.get(DataSource).getRepository(Session);
        app.setGlobalPrefix('api');
        app.use(
            ExpressSession({
                secret: COOKIE_SECRET,
                resave: true,
                name: SESSION_NAME,
                saveUninitialized: true,
                cookie: { maxAge: Number(COOKIE_MAX_AGE) },
                store: new TypeormStore().connect(sessionRepo),
            }),
        );
        app.use(passport.initialize());
        app.use(passport.session());
        await app.init();
    });

    describe('Authentication', () => {
        const sampleUser = { email: 'tom@gmail.com', password:'123' };
        const URL = '/api/auth/login';
        let cookie = '';
        it('should login', (done) => {
            request(app.getHttpServer()).post(URL).send(sampleUser)
            .expect(200)
            .end((err,res) => {
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('should fail to login when incorrect credentials are provided', () => {
            return request(app.getHttpServer()).post(URL).send({
                email: 'tom@gmail.com',
                password:'12345667'
            })
            .expect(401);
        });
        it('should visit /api/auth/status and return 200', async () => {
            return request(app.getHttpServer()).get('/api/auth/status').set('Cookie',cookie).send(sampleUser)
            .expect(200);
        });
        it('should visit /api/auth/status and return 403 when no cookie is provided', async () => {
            return request(app.getHttpServer()).get('/api/auth/status').send(sampleUser)
            .expect(403);
        });
        it('should visit /api/auth/logout and return 200', async () => {
            return request(app.getHttpServer()).post('/api/auth/logout').set('Cookie',cookie).send(sampleUser)
            .expect(200);
        })
        it('should visit /api/auth/logout and return 403 when no cookie is provided', async () => {
            return request(app.getHttpServer()).post('/api/auth/logout').send(sampleUser)
            .expect(403);
        })
    });
    describe('User Creation', () => {
        const URL = '/api/auth/register';
        it('should create a new user', async () => {
            return request(app.getHttpServer())
                .post(URL)
                .send({
                    email: "test2@test.com",
                    username: "TestE2E",
                    firstName: "Test",
                    lastName: "E2E",
                    password: "123"
                })
                .expect(201)
        });
        it('should return a 409 when duplicate email is provided', async () => {
            return request(app.getHttpServer())
                .post(URL)
                .send({
                    email: "test2@test.com",
                    username: "TestE2E",
                    firstName: "Test",
                    lastName: "E2E",
                    password: "123"
                })
                .expect(409)
        });
        it('should return a 400 when an invalid email is provided', async () => {
            return request(app.getHttpServer())
                .post(URL)
                .send({
                    email: "testtt",
                    username: "TestE2E",
                    firstName: "Test",
                    lastName: "E2E",
                    password: "123"
                })
                .expect(400)
        });
    });
    afterAll((done) => {
        app.get(DataSource).close();
        done();
    });
});