const React = require('react');

const toString = x => {
    if (x === null) {
        return 'null';
    }
    if (typeof x === 'boolean') {
        return x ? 'true' : 'false';
    }
    if (typeof x === 'number') {
        return x;
    }
    if (typeof x === 'string') {
        return `"${x}"`;
    }

    return x;
};

const FileInfo = props => {
    if (!props.infoVisible || props.info === undefined) {
        return <div></div>;
    }

    const infos = Object.keys(props.info)
        .filter(key => key !== 'filename') // Displayed elsewhere, and doesn't work here
        .sort()
        .map(key => <li key={key}>{key}: {toString(props.info[key])}</li>);
    const cutoff2 = Math.ceil(infos.length / 2);
    const cutoff3 = Math.ceil(infos.length / 3);

    return (
        <div className="alert alert-info">
            <div className="row">
                <div className="hidden-md-up">
                    <ul className="list-file-info">
                        {infos}
                    </ul>
                </div>

                <div className="col-md-6 hidden-sm-down hidden-xl-up">
                    <ul className="list-file-info">
                        {infos.slice(0, cutoff2)}
                    </ul>
                </div>
                <div className="col-md-6 hidden-sm-down hidden-xl-up">
                    <ul className="list-file-info">
                        {infos.slice(cutoff2)}
                    </ul>
                </div>

                <div className="col-xl-4 hidden-lg-down">
                    <ul className="list-file-info">
                        {infos.slice(0, cutoff3)}
                    </ul>
                </div>
                <div className="col-xl-4 hidden-lg-down">
                    <ul className="list-file-info">
                        {infos.slice(cutoff3, cutoff3 * 2)}
                    </ul>
                </div>
                <div className="col-xl-4 hidden-lg-down">
                    <ul className="list-file-info">
                        {infos.slice(cutoff3 * 2)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

module.exports = FileInfo;
