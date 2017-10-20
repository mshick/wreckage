# Wreckage

[![npm version](https://badge.fury.io/js/wreckage.svg)](https://badge.fury.io/js/wreckage)

[![Build Status](https://travis-ci.org/mshick/wreckage.svg?branch=master)](https://travis-ci.org/mshick/wreckage)

[![Coverage Status](https://coveralls.io/repos/github/mshick/wreckage/badge.svg?branch=master)](https://coveralls.io/github/mshick/wreckage?branch=master)

A convenient, modern request library built around Wreck.

## Overview

A simple wrapper around [Wreck](https://github.com/hapijs/wreck) providing consistent error responses, status code validations, and hashing options.

(Wreck was recently updated to support async/await natively, eliminating my original need for this module, but the sugar is still handy)

## Installation

*NPM*

```bash
$ npm install wreckage --save
```

*Yarn*

```bash
$ yarn add wreckage
```

## Usage

```javascript
import wreckage from 'wreckage';

const request = wreckage.create({
  request: {
    baseUrl: 'https://jsonplaceholder.typicode.com'
  }
});

const getSomething = async function () {
  const {payload} = await request.get('/posts/1');
  // payload.userId === 1
}
```

## Methods

### [`.get(uri, [options])`](#get)
### [`.post(uri, payload, [options])`](#post)
### [`.put(uri, payload, [options])`](#put)
### [`.patch(uri, payload, [options])`](#patch)
### [`.delete(uri, payload, [options])`](#delete)
### [`.create(configuration)`](#create)
### [`.request(method, uri, [options])`](#request)
### [`.defaults`](#defaults)

#### GET

> `.get(uri, [options])`

Performs a GET request

#### POST

> `.post(uri, payload, [options])`

Performs a POST request

#### PUT

> `.put(uri, payload, [options])`

Performs a PUT request

#### PATCH

> `.patch(uri, payload, [options])`

Performs a PUT request

#### DELETE

> `.delete(uri, [options])`

Performs a DELETE request

#### Request

> `.request(method, uri, [options])`

Access the Promise request wrapper for Wreck

#### Create

> `.create([options])`

Create a new instance of Wreckage with your options

#### Defaults

> `.defaults`

Access the defaults for the instance

## Config options

`request` and `read` are passed directly to Wreck, so, you get the same options.

*   [Wreck request](https://github.com/hapijs/wreck#requestmethod-uri-options-callback)
*   [Wreck read](https://github.com/hapijs/wreck#readresponse-options-callback)

Additionally, you'll find:

*   `errorHandling` which allows you to define `return`, to return, rather than throw your errors
*   `validateStatus` allows you to validate the statusCode of your response, to determine what will actually trigger an error
*   `read.hash` you can optionally have a has generated with your payload. Uses  `crypto.createHash` so all hash types supported there are available. Default is `sha1`

This is an example, and these are the defaults.

```javascript
{
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
}
```

## Response object

Something like this:

```javascript
{
  statusCode: 200,
  statusMessage: 'ok',
  payload: {
    userId: 1
  },
  config: {...}, // whatever config was used in the request
  headers: {} // response headers
}
```

Or, if you choose to return your error

```
{
  error: {...} // A Boom wrapped error object
}
```

## Errors

As mentioned above, can be returned or thrown. They get wrapped by [Boom](https://github.com/hapijs/boom), and a fair amount of information is passed through the data object.

## TODO

*   Test coverage
