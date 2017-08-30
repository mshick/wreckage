export default {
  request: {
    headers: {},
    redirects: 3
  },
  read: {
    json: true,
    hash: false
  },
  errorHandling: 'throw',
  validateStatus(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
};
