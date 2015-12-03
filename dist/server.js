'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.queueResponse = queueResponse;
exports.deleteResponse = deleteResponse;
exports.createDefaultRouter = createDefaultRouter;
exports.createExpressApp = createExpressApp;
exports['default'] = createExpressServer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _httpStatusCodes = require('http-status-codes');

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function queueResponse(responses, url, _ref) {
    var status = _ref.status;
    var headers = _ref.headers;
    var text = _ref.text;
    var method = _ref.method;

    return responses.set(url, {
        status: status,
        headers: headers,
        text: text,
        method: method
    });
}

function deleteResponse(responses, url) {
    return responses.has(url) ? responses['delete'](url) : false;
}

function respondWithPostHandler(responses) {
    return function (req, res) {

        if (!req.query.url) {
            res.sendStatus(_httpStatusCodes2['default'].NOT_ACCEPTABLE);
        }

        queueResponse(responses, req.query.url, req.body);

        res.sendStatus(_httpStatusCodes2['default'].OK);
    };
}

function respondWithDeleteHandler(responses) {
    return function (req, res) {

        if (!req.query.url) {
            res.sendStatus(_httpStatusCodes2['default'].NOT_ACCEPTABLE);
        }

        deleteResponse(responses, req.query.url) ? res.sendStatus(_httpStatusCodes2['default'].OK) : res.sendStatus(_httpStatusCodes2['default'].NOT_FOUND);
    };
}

function responseAllHandler(responses) {
    return function (req, res) {
        if (responses.has(req.originalUrl)) {
            var _responses$get = responses.get(req.originalUrl);

            var _status = _responses$get.status;
            var headers = _responses$get.headers;
            var text = _responses$get.text;
            var method = _responses$get.method;

            if (method && req.method !== method) {
                res.sendStatus(_httpStatusCodes2['default'].METHOD_NOT_ALLOWED);
                return;
            }

            res.set(headers);

            res.status(_status).send(JSON.parse(text));
        } else {
            res.sendStatus(_httpStatusCodes2['default'].NOT_FOUND);
        }
    };
}

function createDefaultRouter(responseQueue) {
    var router = new _express.Router();

    router.post('/respond-with', respondWithPostHandler(responseQueue));
    router['delete']('/respond-with', respondWithDeleteHandler(responseQueue));

    router.all('*', responseAllHandler(responseQueue));

    return router;
}

function createExpressApp(_ref2) {
    var router = _ref2.router;

    var app = (0, _express2['default'])();

    app.enable('trust proxy');
    app.disable('x-powered-by');
    app.use(_bodyParser2['default'].json());
    app.use(router);

    return app;
}

function createExpressServer(port, responseQueue, callback) {
    if (port === undefined) port = 3000;

    if (!responseQueue) {
        responseQueue = new Map();
    }

    var app = createExpressApp({
        router: createDefaultRouter(responseQueue)
    });

    var server = _http2['default'].createServer(app);

    server.listen(port, function () {
        callback();
    });

    return server;
}