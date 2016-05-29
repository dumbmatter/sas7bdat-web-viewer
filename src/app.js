const EventEmitter = require('events').EventEmitter;
const React = require('react');
const ReactDOM = require('react-dom');
const SAS7BDAT = require('./sas7bdat');
const Table = require('./components/table')

var emitter = new EventEmitter();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };

        emitter.on('new-data', rows => this.setState({rows}));
    }

    render() {
        return <Table rows={this.state.rows} />;
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('table-wrapper')
);

const fileEl = document.getElementById('sas-file');
const fileLabelEl = document.getElementById('sas-file-label');
fileEl.addEventListener('change', () => {
    if (fileEl.files.length > 0) {
        fileLabelEl.innerHTML = `<span class="alert alert-info" style="padding-top: 13px">${fileEl.value.replace('C:\\fakepath\\', '')}</span>`;

        const file = fileEl.files[0];

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = event => {
            SAS7BDAT.parse(event.target.result)
                .then(rows => emitter.emit('new-data', rows))
                .catch(err => console.log(err));
        };
    }
});