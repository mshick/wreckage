import test from 'ava';
import wreckage from '../src';
import {BASE_URL} from './fixtures/users';

test(`defaults are set correctly`, t => {
  const defaults = wreckage.defaults;

  t.is(defaults.request.redirects, 3);
  t.deepEqual(defaults.request.headers, {});
});

test(`instance methods exist and are the proper type`, t => {
  t.is(typeof (wreckage.get), 'function');
  t.is(typeof (wreckage.post), 'function');
  t.is(typeof (wreckage.put), 'function');
  t.is(typeof (wreckage.delete), 'function');
  t.is(typeof (wreckage.patch), 'function');
  t.is(typeof (wreckage.defaults), 'object');
});

test(`#create(options) overrides the defaults for it's instance`, t => {
  const originalDefaults = wreckage.defaults;

  const config = {
    request: {
      headers: {
        'x-test': 'foo'
      },
      redirects: 5
    },
    read: {
      json: true,
      hash: false
    }
  };

  const instance = wreckage.create(config);

  t.notDeepEqual(instance.defaults, originalDefaults);
  t.deepEqual(instance.defaults.request, config.request);
  t.deepEqual(instance.defaults.read, config.read);
});

test(`#create({validateStatus}) performs custom validations`, async t => {
  const config = {
    validateStatus(statusCode) {
      return statusCode < 500;
    }
  };
  const instance = wreckage.create(config);
  await t.notThrows(instance.get(`${BASE_URL}/users/bogus`));
});

test(`#create({errorHandling: 'return'}) causes errors to be returned, not thrown`, async t => {
  const config = {
    errorHandling: 'return'
  };
  const instance = wreckage.create(config);
  await t.notThrows(instance.get(`${BASE_URL}/users/bogus`));
});

test(`#create({errorHandling: 'return'}) error object is set on returned errors`, async t => {
  const config = {
    errorHandling: 'return'
  };
  const instance = wreckage.create(config);
  const result = await instance.get(`${BASE_URL}/users/bogus`);
  t.truthy(result.error);
});
