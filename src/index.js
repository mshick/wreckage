import defaultsDeep from 'lodash.defaultsdeep';
import defaults from './defaults';
import wreckRequest from './wreck-request';
import wreckRead from './wreck-read';
import request from './request';
import requestWithPayload from './request-with-payload';

const combine = function (options, defaults) {
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
    return wreckRequest(method, uri, combined.request || {});
  },
  read(response, options = {}) {
    const combined = combine(options, this.defaults);
    return wreckRead(response, combined.read || {});
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
