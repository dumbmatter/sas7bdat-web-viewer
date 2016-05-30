const React = require('react');

const FilenameLabel = props => {
    if (props.filename === undefined) {
        return <span></span>;
    }

    return <span className="alert alert-info filename-label">{props.filename}</span>;
};

FilenameLabel.propTypes = {
    filename: React.PropTypes.string,
};

module.exports = FilenameLabel;
