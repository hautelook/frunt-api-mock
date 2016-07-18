'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mock;
exports.createMock = createMock;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

function mock(host, url, resp) {
    return addResponse(host, url, resp);
}

function addResponse(host, url, _ref) {
    var status = _ref.status;
    var headers = _ref.headers;
    var text = _ref.text;
    var method = _ref.method;

    console.log('adding response for', url);

    return new Promise(function (resolve, reject) {
        _request2['default'].post({
            url: host + '/respond-with',
            json: true,
            qs: { url: url },
            body: { status: status, headers: headers, text: text, method: method }
        }, function (err, res) {
            if (err) {
                console.err('failed to load response for', url, err.message);
                return reject(err);
            }

            console.log('added response for', url);

            resolve(res);
        });
    });
}

function clearOne(host, url) {
    console.log('clearing ' + host + url);

    return clear(host, {
        qs: { url: url }
    }, function () {
        console.log('cleared ' + host + url);
    });
}

function clearAll(host) {
    console.log('clearing all responses');

    return clear(host, {}, function () {
        console.log('cleared all responses');
    });
}

function clear(host, options, cb) {
    return new Promise(function (resolve, reject) {
        (0, _request2['default'])((0, _lodash.assign)({
            method: 'DELETE',
            url: host + '/respond-with'
        }, options), function (err, res) {
            if (err) {
                console.err('failed clear responses', err.message);
                return reject(err);
            }

            (0, _lodash.isFunction)(cb) && cb();

            resolve(res);
        });
    });
}

function createMock(host) {
    return {
        add: (0, _lodash.partial)(addResponse, host),
        reset: (0, _lodash.partial)(clearOne, host),
        clear: (0, _lodash.partial)(clearAll, host)
    };
}