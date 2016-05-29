const EventEmitter = require('events').EventEmitter;
const React = require('react');
const ReactDOM = require('react-dom');
const SAS7BDAT = require('./sas7bdat');
const Table = require('./components/table')

var emitter = new EventEmitter();

const FilenameLabel = props => {
    if (props.filename === undefined) {
        return <span></span>;
    }

    return <span className="alert alert-info" style={{marginLeft: '0.25em', paddingTop: '16px', verticalAlign: '2px'}}>{props.filename}</span>;
};

const WithFileButtons = props => {
    if (props.filename === undefined) {
        return <div></div>;
    }

    return (
        <div className="pull-xs-right" style={{paddingTop: '6px'}}>
            <button className="btn btn-secondary" style={{marginRight: '0.25em'}}>File Info</button>
            <button className="btn btn-secondary">Export CSV</button>
        </div>
    );
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: undefined,
            rows: [],
        };

        emitter.on('filename', filename => this.setState({filename}));
        emitter.on('rows', rows => this.setState({rows}));
    }

    render() {
        return (
            <div>
                <div className="container" style={{marginTop: '1em'}}>
                    <p><span className="text-danger">Warning: SAS7BDAT Web Viewer is not 100% accurate.</span> Some files, such as those with certain types of compression or character encodings, will fail.</p>

                    <div className="pull-xs-left" style={{marginBottom: '1em'}}>
                        <label className="btn btn-primary btn-lg" for="sas-file">
                            <input id="sas-file" accept=".sas7bdat" type="file" style={{display: 'none'}} />
                            Select SAS7BDAT File
                        </label>
                        <FilenameLabel filename={this.state.filename} />
                    </div>

                    <WithFileButtons filename={this.state.filename} rows={this.state.rows} />
                </div>
                <div className="container-fluid" style={{textAlign: 'center'}}>
                    <Table rows={this.state.rows} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

const fileEl = document.getElementById('sas-file');
fileEl.addEventListener('change', () => {
    if (fileEl.files.length > 0) {
        emitter.emit('filename', fileEl.value.replace('C:\\fakepath\\', ''));

        const file = fileEl.files[0];

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = event => {
            SAS7BDAT.parse(event.target.result)
                .then(rows => emitter.emit('rows', rows))
                .catch(err => console.log(err));
        };
    }
});