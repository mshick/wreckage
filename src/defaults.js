export default {
  request: {
    headers: {},
    redirects: 3
  },
  read: {
    json: true
  },
  errorHandling: 'throw',
  validateStatus(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
};
