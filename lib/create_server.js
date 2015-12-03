import createServer from './server';
import { last } from 'lodash';

export default (function () {
    const server  = createServer(last(process.argv), null, () => {
        process.send('started.server');
    });

    process.on('close', () => {
        server.close();
    });

})();
