import { get, compact } from 'lodash';
import crypto from 'crypto';

export function isJSON(headers) {
    return get(headers, 'Content-Type', 'application/json') === 'application/json';
}

export function getKeyHash(...args) {
    return crypto
        .createHash('md5')
        .update(compact(args).join(''))
        .digest('base64');
}
