import request from 'request';

export default function mock(host, url, {status, headers, text, method}) {

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
