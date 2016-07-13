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

function clearAll(host) {
    console.log('clearing all responses');
    return new Promise(function (resolve, reject) {
        (0, _request2['default'])({
            method: 'DELETE',
            url: host + '/respond-with'
        }, function (err, res) {
            if (err) {
                console.err('failed clear responses', err.message);
                return reject(err);
            }

            console.log('cleared all responses');

            resolve(res);
        });
    });
}

function createMock(host) {
    return {
        add: (0, _lodash.partial)(addResponse, host),
        clear: (0, _lodash.partial)(clearAll, host)
    };
}