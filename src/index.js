import wreck from 'wreck';
import defaultsDeep from 'lodash.defaultsdeep';
import defaults from './defaults';
import request from './request';
import read from './read';
import requestWithPayload from './request-with-payload';

const combine = (options, defaults) => {
  return defaultsDeep({}, options, defaults);
};

const wreckage = {
  get(uri, options = {}) {
    return request('GET', uri, combine(options, this.defaults));
  },
  post(uri, payload, options = {}) {
    return requestWithPayload('POST', uri, payload, combine(options, this.defaults));
  },
  put(uri, payload, options = {}) {
    return requestWithPayload('PUT', uri, payload, combine(options, this.defaults));
  },
  patch(uri, payload, options = {}) {
    return requestWithPayload('PATCH', uri, payload, combine(options, this.defaults));
  },
  delete(uri, payload, options = {}) {
    return requestWithPayload('DELETE', uri, payload, combine(options, this.defaults));
  },
  request(method, uri, options = {}) {
    const combined = combine(options, this.defaults);
    return wreck.request(method, uri, combined.request || {});
  },
  read(response, options = {}) {
    const combined = combine(options, this.defaults);
    return read(response, combined.read || {});
  },
  create(options = {}) {
    return Object.assign(
      {},
      this,
      {defaults: combine(options, this.defaults)}
    );
  },
  defaults
};

export default wreckage;
