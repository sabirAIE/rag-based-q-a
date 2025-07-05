import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('NestJS Backend is running!');
  });
  // it('/auth/signup (POST)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/signup')
  //     .send({
  //       email: 'testuser@exadmple.com',
  //       password: 'Test@1234',
  //       username: 'Test User',
  //       role:"viewer",
  //     })
  //     .expect(201);

  //   expect(response.body).toHaveProperty('passwordHash');
  // });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'sbransari21@gmail.com',
        password: 'Ammishabbu@1',
      })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
  });
});
