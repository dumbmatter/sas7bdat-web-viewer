/* eslint no-param-reassign: "off", no-underscore-dangle: "off" */
const sas7bdatFactory = require('sas7bdat/build/sas7bdat-factory');

const openFile = () => {
    throw new Error('open_file not implemented');
};

const readFile = (sas7bdat, offset, length) => {
    const slice = sas7bdat._file.slice(offset + sas7bdat.file_pos, length + sas7bdat.file_pos);
    const buffer = Buffer.from(slice);

    const bytesRead = Math.min(slice.byteLength, buffer.length);

    sas7bdat.file_pos += slice.byteLength;

    return {buffer, bytesRead};
};

const seekFile = () => {
    throw new Error('seek_file not implemented');
};

const closeFile = sas7bdat => {
    sas7bdat._file = null;
};

const SAS7BDAT = sas7bdatFactory({
    open_file: openFile,
    read_file: readFile,
    seek_file: seekFile,
    close_file: closeFile,
});

const parseSas7bdat = file => new Promise((resolve, reject) => {
    const rows = [];
    const sas7bdat = new SAS7BDAT(file);
    const stream = sas7bdat.create_read_stream();
    stream.on('data', row => rows.push(row));
    stream.on('end', () => resolve({
        info: sas7bdat.properties,
        rows,
    }));
    stream.on('error', err => reject(err));
});

module.exports = parseSas7bdat;
