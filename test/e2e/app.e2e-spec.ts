import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/users (GET)', () => {
    return request(app.getHttpServer()).get('/v1/users').expect(200);
  });

  it('/v1/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/users/1') // Hier wird der Benutzer mit der ID 1 angefragt
      .expect(200) // Erwarte, dass der Benutzer gefunden wird
      .expect((res) => {
        // Überprüft, ob die Antwort mit dem gewählten Benutzer übereinstimmt
        expect(res.body).toHaveProperty('id', 1);
      });
  });
});
