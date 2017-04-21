import wreck from 'wreck';

const wreckRead = function (response, options) {
  return new Promise((resolve, reject) => {
    wreck.read(response, options, (err, payload) => {
      if (err) {
        return reject(err);
      }
      return resolve(payload);
    });
  });
};

export default wreckRead;
