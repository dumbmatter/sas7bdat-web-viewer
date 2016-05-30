const parseSas7bdat = require('./lib/parse-sas7bdat');

self.addEventListener('message', e => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.data);
    reader.onload = event => {
        postMessage(['status', 'Parsing file...']);
        parseSas7bdat(event.target.result)
            .then(result => {
                postMessage(['status', 'Rendering table...']);
                postMessage(['state', result]);
            })
            .catch(err => {
                postMessage(['state', {
                    error: {
                        message: err.message,
                        type: 'Parsing error',
                    },
                }]);
            })
            .then(() => {
                postMessage(['status', 'Done!']);
            });
    };
});
