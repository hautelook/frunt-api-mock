'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mock;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function mock(host, url, _ref) {
    var status = _ref.status;
    var headers = _ref.headers;
    var text = _ref.text;
    var method = _ref.method;

    return new Promise(function (resolve, reject) {
        _request2['default'].post({
            url: host + '/respond-with',
            json: true,
            qs: { url: url },
            body: { status: status, headers: headers, text: text, method: method }
        }, function (err, res) {
            if (err) {
                return reject(err);
            }

            resolve(res);
        });
    });
}

module.exports = exports['default'];