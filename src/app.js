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

const fileEl = document.getElementById("sas-file");
fileEl.addEventListener("change", () => {
    if (fileEl.files.length > 0) {
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