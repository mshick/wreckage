import test from 'ava';
import wreckage from '../src';
import {USERS, BASE_URL} from './fixtures/users';

test.beforeEach(t => {
  t.context = wreckage.create();
});

test(`#get(uri) that returns 200 with an array`, async t => {
  const {payload} = await t.context.get(`${BASE_URL}/users`);
  t.is(payload.length, USERS.length);
});

test(`#get(uri) that returns 200 with an array and a (default) sha1 hash`, async t => {
  const client = wreckage.create({read: {hash: true}});
  const {payload, hash} = await client.get(`${BASE_URL}/users`);
  t.is(payload.length, USERS.length);
  t.is(hash, 'a6e58a29617e93d5ad146dcd854b1ff24efa33db');
});

test(`#get(uri) that returns 200 with an array and a (custom) md5 hash`, async t => {
  const client = wreckage.create({read: {hash: 'md5'}});
  const {payload, hash} = await client.get(`${BASE_URL}/users`);
  t.is(payload.length, USERS.length);
  t.is(hash, '50bd17b2aede9c0c059faeb62e7e876c');
});

test(`#get(uri) that returns all response properties`, async t => {
  const result = await t.context.get(`${BASE_URL}/users/3`);
  t.is(typeof (result.config), 'object');
  t.is(typeof (result.headers), 'object');
  t.is(typeof (result.statusCode), 'number');
  t.is(typeof (result.payload), 'object');
  t.true(Object.prototype.hasOwnProperty.call(result, 'statusMessage'));
});

test(`#get(uri) error object is a boom object`, async t => {
  try {
    await t.context.get(`${BASE_URL}/users/boom`);
  } catch (err) {
    t.is(err.isBoom, true);
  }
});

test(`#get(uri) that returns 404`, async t => {
  try {
    await t.context.get(`${BASE_URL}/users/bogus`);
  } catch (err) {
    t.regex(err.message, /Found/);
  }
});

test(`#get(url) that returns 200 with an object`, async t => {
  const {payload} = await t.context.get(`${BASE_URL}/users/1`);
  t.deepEqual(payload, USERS[0]);
});

test(`#get(url) throws a malformed object`, async t => {
  const instance = wreckage.create({read: {json: 'force'}});
  try {
    await instance.get(`${BASE_URL}/users/malformed`);
  } catch (err) {
    t.regex(err.message, /Unexpected token f/);
  }
});

test(`#get(url) that returns 200 with an array and query string params`, async t => {
  const {payload} = await t.context.get(`${BASE_URL}/users/search?isActive=true`);
  t.is(payload.length, USERS.length);
});

test(`#get(url) simulate a request error (no net connect)`, async t => {
  try {
    await t.context.get(`http://foo.test/users/malformed`);
  } catch (err) {
    t.regex(err.message, /Nock: Not allow net connect/);
  }
});

test(`#get(url) simulate a request error that returns plain text`, async t => {
  try {
    await t.context.get(`${BASE_URL}/users/text-error`);
  } catch (err) {
    t.is(err.data.payload, 'plain text error');
  }
});

test(`#request('GET', url) that returns 200 with an object`, async t => {
  const response = await t.context.request('GET', `${BASE_URL}/users/2`);
  const payload = await t.context.read(response);
  t.deepEqual(payload.data, USERS[1]);
});
