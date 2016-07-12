'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.isJSON = isJSON;
exports.getKeyHash = getKeyHash;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function isJSON(headers) {
    return (0, _lodash.get)(headers, 'Content-Type', 'application/json') === 'application/json';
}

function getKeyHash() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return _crypto2['default'].createHash('md5').update((0, _lodash.compact)(args).join('')).digest('base64');
}