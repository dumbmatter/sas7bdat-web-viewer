const parseSas7bdat = require('./lib/parse-sas7bdat');

self.addEventListener('message', e => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.data);
    reader.onload = event => {
        postMessage({
            type: 'emit',
            value: ['status', 'Parsing file...'],
        });
        parseSas7bdat(event.target.result)
            .then(result => {
                postMessage({
                    type: 'emit',
                    value: ['status', 'Rendering table...'],
                });
                postMessage({
                    type: 'emit',
                    value: ['state', result],
                });
            })
            .catch(err => {
                postMessage({
                    type: 'emit',
                    value: ['state', {
                        error: {
                            message: err.message,
                            type: 'Parsing error',
                        },
                    }],
                });
            })
            .then(() => {
                postMessage({
                    type: 'emit',
                    value: ['status', 'Done!'],
                });
            });
    };
    postMessage('bar');
});
