import express, { Router } from 'express';
import http from 'http';
import HttpStatus from 'http-status-codes';
import bodyParser from 'body-parser';

export function queueResponse(
    responses,
    url,
    {
        status,
        headers,
        text,
        method
    }
) {

    return responses.set(url, {
        status,
        headers,
        text,
        method
    });
}

export function deleteResponse(responses, url) {
    return responses.has(url) ? responses.delete(url) : false;
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

        if(!req.query.url) {
            res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }

        deleteResponse(responses, req.query.url) ?
            res.sendStatus(HttpStatus.OK) :
            res.sendStatus(HttpStatus.NOT_FOUND);

    };
}

function responseAllHandler(responses) {
    return (req, res) => {
        if(responses.has(req.originalUrl)) {
            const { status, headers, text, method } =
                responses.get(req.originalUrl);

            if (method && req.method !== method) {
                res.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
                return;
            }

            res.set(headers);

            res.status(status).send(JSON.parse(text));

        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
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
    app.use(bodyParser.json());
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
