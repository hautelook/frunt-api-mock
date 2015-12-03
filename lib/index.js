import mock from './client';
import { partial } from 'lodash';
import childProcess from 'child_process';

export default function start(port) {

    const child = childProcess.fork(`${__dirname}/create_server`, [port]);

    return new Promise((resolve, reject) => {

        const timeoutId = setTimeout(() => {
            child.kill();
            reject();
        }, 3000);

        child.on('message', (message) => {
            if(message === 'started.server') {
                clearTimeout(timeoutId);
                resolve({
                    add: partial(mock, `http://localhost:${port}`),
                    stop: () => {
                        child.kill();
                    }
                });
            } else {
                reject();
            }
        });
    });

    process.on('uncaughException', () => {
        child.kill();
    });

}
