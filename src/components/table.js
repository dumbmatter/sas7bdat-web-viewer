const React = require('react');

const Table = props => {
    if (props.rows.length === 0) {
        return <div></div>;
    }

    const colNames = props.rows[0];
    const rows = props.rows.slice(1)

    return (
        <table className="table table-bordered table-hover table-sm table-sas7bdat">
            <thead>
                <tr>
                    {colNames.map((field, j) => <th key={j}>{field}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((field, j) => <td key={j}>{field}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

module.exports = Table;
