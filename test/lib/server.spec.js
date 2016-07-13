import { createExpressApp, createDefaultRouter, queueResponse } from '../../lib/server';
import { getKeyHash } from '../../lib/helpers';
import request from 'supertest';

describe('server', () => {

    function createMockApp() {
        const responses = new Map();
        const app = createExpressApp({
            router: createDefaultRouter(responses)
        });

        return { app, responses};
    }

    describe('POST /respond-with', () => {
        it('can receive a response to queue', (done) => {
            const { app } = createMockApp();

            request(app)
                .post('/respond-with?url=/foo/bar')
                .send({status: 200, headers: {}, text: '{"foo":"bar"}', method: 'GET'})
                .expect(200, done);

        });

        it('correctly queues a response', (done) => {
            const { app, responses } = createMockApp();

            request(app)
                .post('/respond-with?url=/foo/bar')
                .send({status: 200, headers: {}, text: '{"foo":"bar"}', method: 'GET'})
                .expect(200)
                .end(() => {

                    expect(responses.has(getKeyHash('/foo/bar'))).to.be.true;

                    const { status, headers, text, method } =
                        responses.get(getKeyHash('/foo/bar'));

                    expect(status).to.eql(200);
                    expect(headers).to.eql({});
                    expect(text).to.eql('{"foo":"bar"}');
                    expect(method).to.eql('GET');

                    done();
                });

        });
    });

    describe('DELETE /respond-with', () => {

        it('deletes all existing responses', (done) => {

            const { app, responses } = createMockApp();

            responses.set('/foo/bar', {status: 200, method: 'GET'});

            request(app)
                .delete('/respond-with')
                .expect(200)
                .end(() => {
                    expect(responses.size).to.eql(0);
                    done();
                });

        });
    });

    describe('queued response without method specified', () => {
        let app, responses;
        beforeEach(() => {
            const mock = createMockApp();
            app = mock.app;
            responses = mock.responses;
            queueResponse(responses, '/foo/bar', {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': [
                        'SOMECOOKIE=1; Max-Age=31622400; path=/; domain=.test.com',
                        'SOMECOOKIE2=1; Max-Age=31622400; path=/; domain=.test.com'
                    ]
                },
                text: '{"foo":"bar"}'
            });
        });

        it('can respond to GET', (done) => {
            request(app)
                .get('/foo/bar')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect('Set-Cookie', 'SOMECOOKIE=1; Max-Age=31622400; path=/; domain=.test.com,' +
                    'SOMECOOKIE2=1; Max-Age=31622400; path=/; domain=.test.com')
                .expect(200, {foo: 'bar'}, done);
        });

        it('can respond to POST', (done) => {
            request(app)
                .post('/foo/bar')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect('Set-Cookie', 'SOMECOOKIE=1; Max-Age=31622400; path=/; domain=.test.com,' +
                    'SOMECOOKIE2=1; Max-Age=31622400; path=/; domain=.test.com')
                .expect(200, {foo: 'bar'}, done);
        });

        it('can respond to PUT', (done) => {
            request(app)
                .post('/foo/bar')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect('Set-Cookie', 'SOMECOOKIE=1; Max-Age=31622400; path=/; domain=.test.com,' +
                    'SOMECOOKIE2=1; Max-Age=31622400; path=/; domain=.test.com')
                .expect(200, {foo: 'bar'}, done);
        });

        it('can respond to DELETE', (done) => {
            request(app)
                .post('/foo/bar')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect('Set-Cookie', 'SOMECOOKIE=1; Max-Age=31622400; path=/; domain=.test.com,' +
                    'SOMECOOKIE2=1; Max-Age=31622400; path=/; domain=.test.com')
                .expect(200, {foo: 'bar'}, done);
        });
    });


    describe('queued response with GET method specified', () => {
        let app, responses;
        beforeEach(() => {
            const mock = createMockApp();
            app = mock.app;
            responses = mock.responses;
            queueResponse(responses, '/foo/bar', {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': 'SOMECOOKIE=1; expires=Fri, 02-Dec-2016 00:26:52 GMT; Max-Age=31622400; path=/; domain=.test.com'
                },
                text: '{"foo":"bar"}',
                method: 'GET'
            });
        });

        it('can respond to GET', (done) => {
            request(app)
                .get('/foo/bar')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect('Set-Cookie', 'SOMECOOKIE=1; expires=Fri, 02-Dec-2016 00:26:52 GMT; Max-Age=31622400; path=/; domain=.test.com')
                .expect(200, {foo: 'bar'}, done);
        });

        it('does not respond to POST', (done) => {
            request(app)
                .post('/foo/bar')
                .expect(405, done);
        });

    });

    describe('queued response with XML', () => {
        let app, responses;
        beforeEach(() => {
            const mock = createMockApp();
            app = mock.app;
            responses = mock.responses;
            queueResponse(responses, '/foo/bar', {
                status: 200,
                headers: {
                    'Content-Type': 'text/xml'
                },
                text: '<foo><bar>baz</bar><qux>quux</qux></foo>'
            });
        });

        it('can respond to POST', (done) => {
            request(app)
                .post('/foo/bar')
                .send({baz: 'qux'})
                .expect('Content-Type', 'text/xml; charset=utf-8')
                .expect(200, '<foo><bar>baz</bar><qux>quux</qux></foo>', done);
        });
    });

});
