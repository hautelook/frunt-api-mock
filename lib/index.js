import request from 'request';
import { partial } from 'lodash';

export default function mock(host, url, resp) {
    return addResponse(host, url, resp);
}

function addResponse(host, url, {status, headers, text, method}) {
    console.log('adding response for', url);

    return new Promise((resolve, reject) => {
        request.post({
            url: `${host}/respond-with`,
            json: true,
            qs: { url },
            body: {status, headers, text, method}
        }, (err, res) => {
            if(err) {
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
    return new Promise((resolve, reject) => {
        request({
            method: 'DELETE',
            url: `${host}/respond-with`
        }, (err, res) => {
            if(err) {
                console.err('failed clear responses', err.message);
                return reject(err);
            }

            console.log('cleared all responses');

            resolve(res);
        });
    });
}

export function createMock(host) {
    return {
        add: partial(addResponse, host),
        clear: partial(clearAll, host)
    }
}
