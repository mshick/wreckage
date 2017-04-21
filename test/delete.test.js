import test from 'ava';
import wreckage from '../src';
import {BASE_URL} from './fixtures/users';

test.beforeEach(t => {
  t.context = wreckage.create();
});

test('#delete(uri, payload) that returns 204 with an empty payload', async t => {
  const {payload} = await t.context.delete(`${BASE_URL}/users/1`, {});
  t.falsy(payload);
});
