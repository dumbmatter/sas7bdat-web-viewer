const React = require('react');
const csvStringify = require('csv-stringify');

// http://stackoverflow.com/a/31438726/786644
const downloadFile = (filename, text) => {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    let url;
    if (Blob !== undefined) {
        url = window.URL.createObjectURL(new Blob([text], {type: 'text/csv'}));
        link.setAttribute('href', url);
    } else {
        link.setAttribute('href', `data:text/plain,${encodeURIComponent(text)}`);
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (url) {
        // setTimeout is not needed in Chrome, but is in Firefox
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    }
};

const exportCsv = (filename, rows) => {
    csvStringify(rows, (err, output) => {
        if (err) { throw err; }

        downloadFile(filename, output);
    });
};

const ExportCsvButton = props => {
    let filename;
    if (props.filename !== undefined) {
        // Swap sas7bdat with csv at end of filename. If that doesn't produce something that ends in
        // .csv, just tack .csv on to original filename.
        filename = props.filename.replace(/sas7bdat$/i, 'csv');
        if (filename.indexOf('.csv') !== filename.length - 4) {
            filename = `${props.filename}.csv`;
        }
    }

    return (
        <button
            className="btn btn-secondary"
            disabled={props.rows.length === 0}
            onClick={exportCsv.bind(null, filename, props.rows)}
        >
            Export CSV
        </button>
    );
};

ExportCsvButton.propTypes = {
    filename: React.PropTypes.string,
    rows: React.PropTypes.arrayOf(React.PropTypes.array).isRequired,
};

module.exports = ExportCsvButton;
