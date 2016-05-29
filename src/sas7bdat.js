const sas7bdatFactory = require('sas7bdat/build/sas7bdat-factory');

const open_file = () => {
    throw new Error('open_file not implemented');
};

const read_file = (sas7bdat, offset, length) => {
    const slice = sas7bdat._file.slice(offset + sas7bdat.file_pos, length + sas7bdat.file_pos);
    const buffer = Buffer.from(slice);

    const bytesRead = Math.min(slice.byteLength, buffer.length);

    sas7bdat.file_pos += slice.byteLength;

    return {buffer, bytesRead};
};

const close_file = sas7bdat => {
    sas7bdat._file = null;
};

const seek_file = () => {
    throw new Error('seek_file not implemented');
}

const SAS7BDAT = sas7bdatFactory({open_file, read_file, seek_file, close_file});

module.exports = SAS7BDAT;
