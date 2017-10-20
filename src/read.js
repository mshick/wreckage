import crypto from 'crypto';
import wreck from 'wreck';

const read = async (response, options = {}) => {
  let hash;

  if (options.hash) {
    const hashType = typeof options.hash === 'string' ? options.hash : 'sha1';
    const hashData = crypto.createHash(hashType);

    response.on('data', chunk => {
      hashData.update(chunk);
    });

    response.on('end', () => {
      hash = hashData.digest('hex');
    });
  }

  const data = await wreck.read(response, options);

  const payload = {
    data,
    hash
  };

  return payload;
};

export default read;
