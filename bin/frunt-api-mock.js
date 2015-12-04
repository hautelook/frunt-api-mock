#!/usr/bin/env node
var argv = require('yargs').options({
    p: {
        demand: false,
        alias: 'port',
        default: 8070,
        describe: 'API Mock Port [8070]',
        type: 'string'
    }
}).help('help').argv;

createServer = require('../dist/create_server');

var server = createServer(argv.port);

process.on('SIGINT', () => {
    console.log('cleaning up server');
    server.close();
});
