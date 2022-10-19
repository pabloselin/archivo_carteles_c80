const path = require("path");
const fs = require("fs");

//joining path of directory
const directoryPath = path.join(__dirname, "data/");

let papaJason = {
  responses: [],
};

let id_index = 0;

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  //listing all files using forEach
  files.forEach(function (file, index) {
    // Do whatever you want to do with the file
    let babyFile = path.join(directoryPath, file);
    let jason = JSON.parse(fs.readFileSync(babyFile));

    jason.responses.forEach(function (response, idx) {
      let labels = [];
      if (response.labelAnnotations)
        labels = response.labelAnnotations.map((l) => l.description);
      let objects = [];
      if (response.localizedObjectAnnotations)
        objects = response.localizedObjectAnnotations.map((l) => l.name);

      let currentID = `AC${pad(id_index++, 4)}`;

      let o = {
        labels: labels,
        objects: objects,
        words: response.fullTextAnnotation
          ? response.fullTextAnnotation.text
          : "",
        url: response.context.uri.replace(
          "gs://",
          "https://archivocarteles.c80.cl/"
        ),
        id: currentID,
      };
      console.log(o.url, currentID);
      papaJason.responses.push(o);
    });
    console.log(papaJason.responses.length);
  });

  // console.log(papaJason);
  fs.writeFileSync(
    `./combinedData_inst_ID.js`,
    `let data = ${JSON.stringify(papaJason)}`
  );
});

//console.log(papaJason.responses.length);
