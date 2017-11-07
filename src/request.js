import Boom from 'boom';
import wreck from 'wreck';
import read from './read';
import defaults from './defaults';

const wrapError = (err, data) => {
  if (!err.data) {
    Object.assign(err, {data});
  }

  if (Boom.isBoom(err)) {
    return err;
  }

  const statusCode = data.statusCode >= 400 ? data.statusCode : 500;

  return Boom.boomify(err, {statusCode, message: data.statusMessage});
};

const request = async (method, uri, options = {}) => {
  const requestOptions = options.request || {};
  const readOptions = options.read || {};
  const validateStatus = options.validateStatus || defaults.validateStatus;
  const errorHandling = options.errorHandling || 'throw';

  let output = {
    config: {
      method,
      uri,
      ...options
    }
  };

  try {
    const response = await wreck.request(method, uri, requestOptions);

    const {statusCode, statusMessage, headers} = response;

    output = {
      ...output,
      headers,
      statusCode,
      statusMessage
    };

    const payload = await read(response, readOptions);

    output = {
      ...output,
      payload: payload.data,
      hash: payload.hash
    };

    if (validateStatus(output.statusCode) === false) {
      if (readOptions.json && Buffer.isBuffer(output.payload)) {
        // Get some info on the error, even if it disobeys our expect response type
        output.payload = output.payload.toString();
      }

      throw new Boom(
        output.statusMessage,
        {
          statusCode: output.statusCode,
          data: output
        }
      );
    }

    return output;
  } catch (err) {
    const error = wrapError(err, output);

    if (errorHandling === 'return') {
      return {error};
    }

    throw error;
  }
};

export default request;
