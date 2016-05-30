const classNames = require('classnames');
const React = require('react');

const FileInfoButton = props => {
    const classes = ['btn', 'btn-secondary'];
    if (props.infoVisible) {
        classes.push('active');
    }

    return <button className={classNames(classes)} disabled={props.filename === undefined} onClick={props.onClick} style={{marginRight: '0.25em'}}>File Info</button>;
};

FileInfoButton.propTypes = {
    filename: React.PropTypes.string,
    infoVisible: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired,
};

module.exports = FileInfoButton;
