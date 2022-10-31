import request from 'supertest';
import App from '@/app';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { getConnectionManager } from 'typeorm';

let app: App;

beforeAll(async () => {
  app = new App([authResolver, userResolver])
});

afterAll(async () => {
  // Clear all entities from database

  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
})

describe('Testing Index', () => {
  describe('[GET] /graphql', () => {
    it('response statusCode 200', async () => {
      const getUsers = {
        query: `query users {
          getUsers {
            id
            email
          }
        }`
      }
      const response = await request(app.getApp()).post('/graphql').send(getUsers);
      return response;
    });
  });
});
