import request from './request';

const requestWithPayload = function (method, uri, payload, options = {}) {
  options.request = options.request || {};
  options.request.payload = payload;
  return request(method, uri, options);
};

export default requestWithPayload;
