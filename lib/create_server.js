import createServer from './server';
import { last } from 'lodash';

export default function (port) {
    return createServer(port, null, () => {
        console.log('mock server started.');
    });
};
