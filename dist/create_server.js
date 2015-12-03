'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _lodash = require('lodash');

exports['default'] = (function () {
    var server = (0, _server2['default'])((0, _lodash.last)(process.argv), null, function () {
        process.send('started.server');
    });

    process.on('close', function () {
        server.close();
    });
})();

module.exports = exports['default'];