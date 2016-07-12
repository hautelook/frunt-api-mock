'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.queueResponse = queueResponse;
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

var _lodash = require('lodash');

var _helpers = require('./helpers');

function queueResponse(responses, url, params) {
    return responses.set((0, _helpers.getKeyHash)(url), params);
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
        responses.clear();
        res.sendStatus(_httpStatusCodes2['default'].OK);
    };
}

function responseAllHandler(responses) {
    return function (req, res) {
        if (!responses.has((0, _helpers.getKeyHash)(req.originalUrl))) {
            return res.sendStatus(_httpStatusCodes2['default'].NOT_FOUND);
        }

        var _responses$get = responses.get((0, _helpers.getKeyHash)(req.originalUrl));

        var status = _responses$get.status;
        var headers = _responses$get.headers;
        var text = _responses$get.text;
        var method = _responses$get.method;
        var body = _responses$get.body;

        if ((method && req.method) !== method) {
            return res.sendStatus(_httpStatusCodes2['default'].METHOD_NOT_ALLOWED);
        }

        if (body && body !== req.body) {
            return res.sendStatus(_httpStatusCodes2['default'].BAD_REQUEST);
        }

        (0, _lodash.map)(headers, function (value, key) {

            if ((0, _lodash.isArray)(value)) {
                return (0, _lodash.map)(value, function (v) {
                    res.set(key, v);
                });
            }

            return res.set(key, value);
        });

        if ((0, _helpers.isJSON)(headers)) {
            res.status(status).send(JSON.parse(text));
        } else {
            res.status(status).send(text);
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

function createExpressApp(_ref) {
    var router = _ref.router;

    var app = (0, _express2['default'])();

    app.enable('trust proxy');
    app.disable('x-powered-by');
    app.use(_bodyParser2['default'].json({ limit: '5mb' }));
    app.use(_bodyParser2['default'].urlencoded({ limit: '5mb' }));
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