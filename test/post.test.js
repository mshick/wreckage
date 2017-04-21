import test from 'ava';
import wreckage from '../src';
import {BASE_URL} from './fixtures/users';

test.beforeEach(t => {
  t.context = wreckage.create();
});

test('#post(uri, payload) that returns 201 with an object', async t => {
  const {payload} = await t.context.post(`${BASE_URL}/users`, {});
  t.is(payload.firstName, 'Bob');
});
