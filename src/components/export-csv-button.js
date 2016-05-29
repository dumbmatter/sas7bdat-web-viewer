const React = require('react');
const csvStringify = require('csv-stringify');

const exportCsv = rows => {
    csvStringify(rows, (err, output) => {
        if (err) { throw err; }

        console.log(output);
    });
};

const ExportCsvButton = props => {
    return <button className="btn btn-secondary" disabled={props.rows.length === 0} onClick={exportCsv.bind(null, props.rows)}>Export CSV</button>;
};

module.exports = ExportCsvButton;
