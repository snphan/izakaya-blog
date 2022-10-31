import request from 'supertest';
import { CreateUserDto } from '@dtos/users.dto';
import { CustomRepositoryCannotInheritRepositoryError, getConnection, getConnectionManager, getRepository } from 'typeorm';
import AuthRepository from '@repositories/auth.repository';
import { UserEntity } from "@entities/users.entity"
import { dbConnection } from '@databases';

import App from '@/app';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { Server } from 'http';

let app: App;

beforeAll(async () => {
  app = new App([authResolver, userResolver]);
  // Prevent the No Repository for [Entity] error by waiting....
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});


afterAll(async () => {
  // Clear all entities from database
  const entities = getConnection().entityMetadatas;
  entities.forEach(async entity => {
    const repository = getConnection().getRepository(entity.name);
    await repository.clear();
  })
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
})


describe('Testing Auth', () => {

  describe('Mutations to User Entity', () => {
    it('response should have the Create userData', async () => {

      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const createUserMutation = {
        query: `mutation createUser($userData: CreateUserDto!) {
            createUser(userData: $userData) {
              email
            }
          }`,
        variables: { userData: userData }
      };

      expect(true).toBeTruthy();

      const response = await request(app.getApp()).post('/graphql').send(createUserMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createUser.email).toBe(userData.email);
      return response;
    });
  });

  // describe('[POST] /login', () => {
  //   it('response should have the Set-Cookie header with the Authorization token', async () => {
  //     const userData: CreateUserDto = {
  //       email: 'test@email.com',
  //       password: 'q1w2e3r4',
  //     };

  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/login')
  //       .send(userData)
  //       .expect('Set-Cookie', /^Authorization=.+/);
  //   });
  // });

  // error: StatusCode : 404, Message : Authentication token missing
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/logout')
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
