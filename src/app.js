const classNames = require('classnames');
const EventEmitter = require('events').EventEmitter;
const React = require('react');
const ReactDOM = require('react-dom');
const ExportCsvButton = require('./components/export-csv-button');
const Table = require('./components/table');
const parseSas7bdat = require('./lib/parse-sas7bdat');

const FilenameLabel = props => {
    if (props.filename === undefined) {
        return <span></span>;
    }

    return <span className="alert alert-info" style={{marginLeft: '0.25em', paddingTop: '16px', verticalAlign: '2px'}}>{props.filename}</span>;
};

const FileInfoButton = props => {
    const classes = ['btn', 'btn-secondary'];
    if (props.infoVisible) {
        classes.push('active');
    }

    return <button className={classNames(classes)} disabled={props.filename === undefined} onClick={props.onClick} style={{marginRight: '0.25em'}}>File Info</button>;
}

const FileInfo = props => {
    if (!props.infoVisible) {
        return <div></div>;
    }

    return <div><pre>{JSON.stringify(props.info, null, 2)}</pre></div>;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: undefined,
            rows: [],
            infoVisible: false,
        };

        this.emitter = new EventEmitter();
        this.emitter.on('filename', filename => this.setState({filename}));
        this.emitter.on('file-contents', result => this.setState(result));
    }

    handleFileChange(e) {
        if (e.target.files.length > 0) {
            // http://stackoverflow.com/q/4851595/786644
            const filename = e.target.value.replace('C:\\fakepath\\', '');
            this.emitter.emit('filename', filename);

            const file = e.target.files[0];

            const reader = new window.FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = event => {
                parseSas7bdat(event.target.result)
                    .then(result => this.emitter.emit('file-contents', result))
                    .catch(err => console.log(err));
            };
        }
    }

    toggleFileInfoVisibile() {
console.log('toggleFileInfoVisibile')
        this.setState({infoVisible: !this.state.infoVisible});
    }

    render() {
        return (
            <div>
                <div className="container" style={{marginTop: '1em'}}>
                    <div className="row">
                        <div className="col-md-4">
                            <p>Here you can view SAS7BDAT files right in your browser, or convert them to CSV files which you can open in Excel and many other programs.</p>
                        </div>
                        <div className="col-md-4">
                            <p><span className="text-danger">SAS7BDAT Web Viewer is not 100% accurate.</span> Some files, such as those with certain types of compression or character encodings, will fail.</p>
                        </div>
                        <div className="col-md-4">
                            <p><span className="text-success">Your data will not leave your computer.</span> Processing is done client-side on your machine, nothing is sent to any remote server.</p>
                        </div>
                    </div>

                    <div className="pull-xs-left">
                        <label className="btn btn-primary btn-lg" for="sas-file">
                            <input accept=".sas7bdat" type="file" style={{display: 'none'}} onChange={this.handleFileChange.bind(this)} />
                            Select SAS7BDAT File
                        </label>
                        <FilenameLabel filename={this.state.filename} />
                    </div>

                    <div className="pull-xs-right" style={{paddingTop: '6px'}}>
                        <FileInfoButton filename={this.state.filename} infoVisible={this.state.infoVisible} onClick={this.toggleFileInfoVisibile.bind(this)} />
                        <ExportCsvButton filename={this.state.filename} rows={this.state.rows} />
                    </div>

                    <div className="clearfix"></div>
                    <FileInfo infoVisible={this.state.infoVisible} info={this.state.info} />
                </div>
                <div className="container-fluid">
                    <center>
                        <Table rows={this.state.rows} />
                    </center>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
