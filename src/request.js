import boom from 'boom';
import defaults from './defaults';
import wreckRead from './wreck-read';
import wreckRequest from './wreck-request';

const wrapError = function (err, data) {
  if (!err.data) {
    Object.assign(err, {data});
  }

  if (err.isBoom) {
    return err;
  }

  const statusCode = data.statusCode >= 400 ? data.statusCode : 500;

  return boom.wrap(err, statusCode, data.statusMessage);
};

const request = async function (method, uri, options = {}) {
  const requestOptions = options.request || {};
  const readOptions = options.read || {};
  const validateStatus = options.validateStatus || defaults.validateStatus;
  const errorHandling = options.errorHandling || 'throw';

  let res;

  let response = {
    config: {
      method,
      uri,
      ...options
    }
  };

  try {
    res = await wreckRequest(method, uri, requestOptions);

    const {statusCode, statusMessage, headers} = res;

    response = {
      ...response,
      headers,
      statusCode,
      statusMessage
    };
  } catch (err) {
    response = {
      statusCode: 400,
      statusMessage: 'wreck request failed',
      ...response
    };

    const error = wrapError(err, response);

    if (errorHandling === 'return') {
      return {error};
    }

    throw error;
  }

  try {
    const payload = await wreckRead(res, readOptions);

    if (readOptions.hash) {
      response.payload = payload.payload;
      response.hash = payload.hash;
    } else {
      response.payload = payload;
    }

    if (validateStatus(response.statusCode) === false) {
      throw boom.create(
        response.statusCode,
        response.statusMessage,
        {
          ...response,
          isResponseError: true
        }
      );
    }

    return response;
  } catch (err) {
    const error = wrapError(err, response);

    if (errorHandling === 'return') {
      return {error};
    }

    throw error;
  }
};

export default request;
