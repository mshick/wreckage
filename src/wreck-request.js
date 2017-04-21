import wreck from 'wreck';

const wreckRequest = function (method, uri, options = {}) {
  return new Promise((resolve, reject) => {
    wreck.request(method, uri, options, (err, response) => {
      if (err) {
        return reject(err);
      }
      return resolve(response);
    });
  });
};

export default wreckRequest;
