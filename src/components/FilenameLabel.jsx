const React = require('react');

const FilenameLabel = props => {
    if (props.filename === undefined) {
        return <span></span>;
    }

    return <span className="alert alert-info" style={{marginLeft: '0.25em', paddingTop: '16px', verticalAlign: '2px'}}>{props.filename}</span>;
};

FilenameLabel.propTypes = {
    filename: React.PropTypes.string,
};

module.exports = FilenameLabel;
