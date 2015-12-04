'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _lodash = require('lodash');

exports['default'] = function (port) {
    return (0, _server2['default'])(port, null, function () {
        console.log('mock server started.');
    });
};

;
module.exports = exports['default'];