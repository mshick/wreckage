import defaultsDeep from 'lodash.defaultsdeep';
import defaults from './defaults';
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
    return request(method, uri, combine(options, this.defaults));
  },
  create(options = {}) {
    // console.log('opts', options);
    // console.log('opts2', combine(options, this.defaults));
    return Object.assign(
      {},
      this,
      {defaults: combine(options, this.defaults)}
    );
  },
  defaults
};

export default wreckage;
