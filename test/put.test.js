import test from 'ava';
import wreckage from '../src';
import {BASE_URL} from './fixtures/users';

test.beforeEach(t => {
  t.context = wreckage.create();
});

test('#put(uri, payload) that returns 201 with an object', async t => {
  const {payload} = await t.context.put(`${BASE_URL}/users/1`, {});
  t.is(payload.firstName, 'Bob');
});
