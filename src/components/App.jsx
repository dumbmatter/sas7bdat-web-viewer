const EventEmitter = require('events').EventEmitter;
const React = require('react');
const ExportCsvButton = require('./ExportCsvButton.jsx');
const ErrorAlert = require('./ErrorAlert.jsx');
const FileInfo = require('./FileInfo.jsx');
const FileInfoButton = require('./FileInfoButton.jsx');
const FilenameLabel = require('./FilenameLabel.jsx');
const Status = require('./Status.jsx');
const Table = require('./Table.jsx');
const parseSas7bdat = require('../lib/parse-sas7bdat');

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: undefined,
            filename: undefined,
            info: undefined,
            infoVisible: false,
            rows: [],
            status: [],
        };

        this.emitter = new EventEmitter();
        this.emitter.on('state', state => this.setState(state));
        this.emitter.on('status', status => {
            if (status === 'Done!') {
                this.setState({status: []});
            } else {
                this.setState({status: this.state.status.concat(status)});
            }
        });

        this.worker = new Worker('worker.js');
        this.worker.addEventListener('message', e => {
            if (e.data.type === 'emit') {
                this.emitter.emit(...e.data.value);
            } else {
                console.log(e.data);
            }
        });
    }

    handleFileChange(e) {
        if (e.target.files.length > 0) {
            this.emitter.emit('status', 'Reading file...');
            this.emitter.emit('state', {
                error: undefined,
                filename: undefined,
                rows: [],
            });

            // http://stackoverflow.com/q/4851595/786644
            const filename = e.target.value.replace('C:\\fakepath\\', '');
            this.emitter.emit('state', {filename});

            const file = e.target.files[0];
            this.worker.postMessage(file);
        }
    }

    toggleFileInfoVisibile() {
        this.setState({infoVisible: !this.state.infoVisible});
    }

    render() {
        return (
            <div>
                <div className="container" style={{marginTop: '1em'}}>
                    <div className="row">
                        <div className="col-md-4">
                            <p>
                                Here you can view SAS7BDAT files right in your browser, or convert
                                them to CSV files which you can open in Excel and many other
                                programs.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <p>
                                <span className="text-danger">SAS7BDAT Web Viewer is not 100%
                                accurate.</span> Some files, such as those with certain types of
                                compression or character encodings, will fail.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <p>
                                <span className="text-success">Your data will not leave your
                                computer.</span> Processing is done client-side on your machine,
                                nothing is sent to any remote server.
                            </p>
                        </div>
                    </div>

                    <div className="pull-xs-left">
                        <label className="btn btn-primary btn-lg" htmlFor="sas-file">
                            <input
                                id="sas-file"
                                accept=".sas7bdat"
                                type="file"
                                style={{display: 'none'}}
                                onChange={e => this.handleFileChange(e)}
                            />
                            Select SAS7BDAT File
                        </label>
                        <FilenameLabel filename={this.state.filename} />
                    </div>

                    <div className="pull-xs-right" style={{paddingTop: '6px'}}>
                        <FileInfoButton
                            info={this.state.info}
                            infoVisible={this.state.infoVisible}
                            onClick={() => this.toggleFileInfoVisibile()}
                        />
                        <ExportCsvButton filename={this.state.filename} rows={this.state.rows} />
                    </div>

                    <div className="clearfix" style={{marginBottom: '0.5em'}} />
                    <ErrorAlert error={this.state.error} />
                    <FileInfo infoVisible={this.state.infoVisible} info={this.state.info} />
                </div>
                <div className="container-fluid">
                    <Status status={this.state.status} />
                    <Table rows={this.state.rows} />
                </div>
            </div>
        );
    }
}

module.exports = App;
