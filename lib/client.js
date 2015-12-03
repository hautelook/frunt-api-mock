import request from 'request';

export default function mock(host, url, {status, headers, text, method}) {

        return new Promise((resolve, reject) => {
            request.post({
                url: `${host}/respond-with`,
                json: true,
                qs: { url },
                body: {status, headers, text, method}
            }, (err, res) => {
                if(err) {
                    return reject(err);
                }

                resolve(res);
            });
        });

}
