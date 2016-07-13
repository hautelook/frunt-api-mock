import express, { Router } from 'express';
import http from 'http';
import HttpStatus from 'http-status-codes';
import bodyParser from 'body-parser';
import { map, isArray } from 'lodash';
import { isJSON, getKeyHash } from './helpers';

export function queueResponse(
    responses,
    url,
    params
) {
    return responses.set(getKeyHash(url), params);
}

function respondWithPostHandler(responses) {
    return (req, res) => {

        if(!req.query.url) {
            res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }

        queueResponse(responses, req.query.url, req.body);

        res.sendStatus(HttpStatus.OK);

    };
}

function respondWithDeleteHandler(responses) {
    return (req, res) => {
        responses.clear();
        res.sendStatus(HttpStatus.OK);
    };
}

function responseAllHandler(responses) {
    return (req, res) => {
        if(!responses.has(getKeyHash(req.originalUrl))) {
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }

        const { status, headers, text, method, body } =
            responses.get(getKeyHash(req.originalUrl));

        if ((method && req.method) !== method) {
            return res.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
        }

        if(body && body !== req.body) {
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }

        map(headers, (value, key) => {
            return res.append(key, value);
        });

        if(isJSON(headers)) {
            res.status(status).send(JSON.parse(text));
        } else {
            res.status(status).send(text);
        }
    };
}

export function createDefaultRouter(responseQueue) {
    const router = new Router();

    router.post('/respond-with', respondWithPostHandler(responseQueue));
    router.delete('/respond-with', respondWithDeleteHandler(responseQueue));

    router.all('*', responseAllHandler(responseQueue));

    return router;
}

export function createExpressApp({ router }) {
    const app = express();

    app.enable('trust proxy');
    app.disable('x-powered-by');
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({limit: '5mb'}));
    app.use(router);

    return app;
}


export default function createExpressServer(port = 3000, responseQueue, callback) {

    if (!responseQueue) {
        responseQueue = new Map();
    }

    const app = createExpressApp({
        router: createDefaultRouter(responseQueue)
    });

    const server = http.createServer(app);

    server.listen(port, () => {
        callback();
    });

    return server;
}
