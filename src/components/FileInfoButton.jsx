const classNames = require('classnames');
const React = require('react');

const FileInfoButton = props => {
    const classes = ['btn', 'btn-secondary'];
    if (props.infoVisible) {
        classes.push('active');
    }

    return (
        <button
            className={classNames(classes)}
            disabled={props.info === undefined}
            onClick={props.onClick}
            style={{marginRight: '0.25em'}}
        >
            File Info
        </button>
    );
};

FileInfoButton.propTypes = {
    info: React.PropTypes.object,
    infoVisible: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired,
};

module.exports = FileInfoButton;
