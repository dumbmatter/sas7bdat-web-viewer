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

        emitter.on('rows', rows => this.setState({rows}));
    }

    render() {
        return (
            <div>
                <div className="container" style={{marginTop: '1em'}}>
                    <p><span className="text-danger">Warning: SAS7BDAT Web Viewer is not 100% accurate.</span> Some files, such as those with certain types of compression or character encodings, will fail.</p>

                    <div style={{marginBottom: '1em'}}>
                        <label className="btn btn-primary btn-lg" for="sas-file">
                            <input id="sas-file" accept=".sas7bdat" type="file" style={{display: 'none'}} />
                            Select SAS7BDAT File
                        </label>
                        <span id="sas-file-label" style={{marginLeft: '0.25em'}}></span>
                    </div>
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
const fileLabelEl = document.getElementById('sas-file-label');
fileEl.addEventListener('change', () => {
    if (fileEl.files.length > 0) {
        fileLabelEl.innerHTML = `<span class="alert alert-info" style="padding-top: 16px; vertical-align: 2px">${fileEl.value.replace('C:\\fakepath\\', '')}</span>`;

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