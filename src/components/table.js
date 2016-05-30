const React = require('react');

// Everything except render() is for sticky columns
class Table extends React.Component {
    getTableFixedLeft() {
        return this.tableRef.offsetLeft - document.body.scrollLeft;
    }

    checkFixedHeaderVisibility() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.tableFixedRef.style.display = scrollTop > this.tableRef.offsetTop ? 'table' : 'none';
    }

    handleResizeScroll() {
        if (this.tableFixedRef) {
            this.checkFixedHeaderVisibility();
            this.tableFixedRef.style.left = `${this.getTableFixedLeft()}px`;
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResizeScroll.bind(this));
        window.addEventListener('scroll', this.handleResizeScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResizeScroll.bind(this));
        window.removeEventListener('scroll', this.handleResizeScroll.bind(this));
    }

    componentDidUpdate() {
        if (this.tableRef) {
            const theadRef = this.tableRef.getElementsByTagName('thead')[0];

            // If we already have a fixed header (like from a previous file), remove it and create a new one
            if (this.tableFixedRef) {
                document.body.removeChild(this.tableFixedRef);
            }

            this.tableFixedRef = this.tableRef.cloneNode(false);
            const theadFixedRef = theadRef.cloneNode(true);

            // Manually set widths
            this.tableFixedRef.style.tableLayout = 'FixedRef';
            this.tableFixedRef.style.width = `${this.tableRef.offsetWidth}px`;
            const ths = theadRef.firstChild.childNodes;
            const thsFixedRef = theadFixedRef.firstChild.childNodes;
            for (let i = 0; i < ths.length; i++) {
                thsFixedRef[i].style.width = `${ths[i].offsetWidth}px`;
            }

            // Fixed positioning
            this.tableFixedRef.style.position = 'fixed';
            this.tableFixedRef.style.top = '0';
            this.tableFixedRef.style.left = `${this.getTableFixedLeft()}px`;
            this.tableFixedRef.style.backgroundColor = '#ffffff';

            this.checkFixedHeaderVisibility();
            this.tableFixedRef.appendChild(theadFixedRef);
            document.body.appendChild(this.tableFixedRef);
        }
    }

    render() {
        if (this.props.rows.length === 0) {
            return <div></div>;
        }

        const colNames = this.props.rows[0];
        const rows = this.props.rows.slice(1)

        return (
            <table ref={ref => this.tableRef = ref} className="table table-bordered table-hover table-sm table-sas7bdat">
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
    }
};

module.exports = Table;
