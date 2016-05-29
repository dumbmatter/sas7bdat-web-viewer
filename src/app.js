const SAS7BDAT = require('./sas7bdat');

const fileEl = document.getElementById("sas-file");
fileEl.addEventListener("change", () => {
    const file = fileEl.files[0];

    const reader = new window.FileReader();
//    reader.readAsBinaryString(file);
//    reader.readAsText(file);
    reader.readAsArrayBuffer(file);
    reader.onload = event => {
        SAS7BDAT.parse(event.target.result)
            .then(rows => console.log(rows))
            .catch(err => console.log(err));
    };
});