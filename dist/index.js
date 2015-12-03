'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _lodash = require('lodash');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function start(port) {

    var child = _child_process2['default'].fork(__dirname + '/create_server', [port]);

    return new Promise(function (resolve, reject) {

        var timeoutId = setTimeout(function () {
            child.kill();
            reject();
        }, 3000);

        child.on('message', function (message) {
            if (message === 'started.server') {
                clearTimeout(timeoutId);
                resolve({
                    add: (0, _lodash.partial)(_client2['default'], 'http://localhost:' + port),
                    stop: function stop() {
                        child.kill();
                    }
                });
            } else {
                reject();
            }
        });
    });

    process.on('uncaughException', function () {
        child.kill();
    });
}

module.exports = exports['default'];