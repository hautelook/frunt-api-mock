import request from 'request';
import { assign, isFunction, partial } from 'lodash';

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

function clearOne(host, url) {
    console.log(`clearing ${host}${url}`);

    return clear(host, {
        qs: { url }
    }, () => {
        console.log(`cleared ${host}${url}`);
    });
}


function clearAll(host) {
    console.log('clearing all responses');

    return clear(host, {}, () => {
        console.log('cleared all responses');
    });
}

function clear(host, options, cb) {
    return new Promise((resolve, reject) => {
        request(assign({
            method: 'DELETE',
            url: `${host}/respond-with`
        }, options), (err, res) => {
            if(err) {
                console.err('failed clear responses', err.message);
                return reject(err);
            }

            isFunction(cb) && cb();

            resolve(res);
        });
    });
}

export function createMock(host) {
    return {
        add: partial(addResponse, host),
        reset: partial(clearOne, host),
        clear: partial(clearAll, host)
    }
}
