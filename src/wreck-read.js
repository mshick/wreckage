import crypto from 'crypto';
import wreck from 'wreck';

const wreckRead = function (response, options) {
  return new Promise((resolve, reject) => {
    let digest;

    if (options.hash) {
      const hashType = typeof options.hash === 'string' ? options.hash : 'sha1';
      const hash = crypto.createHash(hashType);

      response.on('data', chunk => {
        hash.update(chunk);
      });

      response.on('end', () => {
        digest = hash.digest('hex');
      });
    }

    wreck.read(response, options, (err, payload) => {
      if (err) {
        return reject(err);
      }

      if (options.hash) {
        return resolve({
          hash: digest,
          payload
        });
      }

      return resolve(payload);
    });
  });
};

export default wreckRead;
