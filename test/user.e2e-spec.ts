import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
    let app: INestApplication;

    // Set up Nest environment and start server
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();
    });

    describe('User Creation (POST) `/api/auth/register`', () => {
        it('should create a new user', async () => {
            return request(app.getHttpServer())
                .post('/api/auth/register')
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
                .post('/api/auth/register')
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
                .post('/api/auth/register')
                .send({
                    email: "testtt",
                    username: "TestE2E",
                    firstName: "Test",
                    lastName: "E2E",
                    password: "123"
                })
                .expect(400)
        })
    })
})