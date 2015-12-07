#Frunt API Mock
Mock API server to use as a backend for Frunt. The idea is to have a backend that can provide your app with any type of success or failure response.

#Installation
```
npm install --save-dev git@github.com:hautelook/frunt-api-mock.git
```

#Usage

The bin file provided starts the mock server at http://localhost:8070. An optional port parameter can be provided:

```
./bin/frunt-api-mock -p 8070
```

The module provides a client to add responses to our mock server. 
The responses can be easily be constructed with a plain object that has the following properties:
- status: any valid http status
- headers: any http header and
- text: any valid JSON payload 
- method: GET, POST, PUT, DELETE (When no method is specified the server will respond to all) 

```javascript
import mock from 'frunt-api-mock'

mock(
  'http://localhost:8070',
  '/api/resource/1',
  {
    status: 200,
    headers: {'Content-Type': 'application/json'},
    text: '{"foo": "bar"}',
    method: 'GET'   
  }
); 

```

This provides adds a response to the mock server at `/api/resource/1` that only responds to a 'GET' request.
