// import labelsTable from "../json/labelsTable.js";
// import labelsTableES from "../json/labelsTranslationTable.js";
// import objectsTable from "../json/objectsTable.js";
// import objectsTableES from "../json/objectsTranslationTable";
// import data from "../json/combinedData_inst.json";

const path = require("path");
const fs = require("fs");

const directoryPath = path.join(__dirname, "json/");

const file = path.join(directoryPath, "combinedData_inst.json");
const fileData = JSON.parse(fs.readFileSync(file));
const labels = path.join(directoryPath, "labelsTable.json");
const labelsData = JSON.parse(fs.readFileSync(labels));
const objects = path.join(directoryPath, "objectsTable.json");
const objectsData = JSON.parse(fs.readFileSync(objects));

const labelsESFile = path.join(directoryPath, "labelsTranslationTable.json");
const objectsESFile = path.join(directoryPath, "objectsTranslationTable.json");
const labelsES = JSON.parse(fs.readFileSync(labelsESFile));
const objectsES = JSON.parse(fs.readFileSync(objectsESFile));

/*
	{
		itemValue: 'cat',
		itemTitle: 'gato',
		itemOcurrences: 23 
	}
*/
let newLabelsData = {};
let newObjectsData = {};
//iterar por todos los labels
//console.log(fileData);

//poner traducción
const translatedStringFromArray = (string, index, translationArray) => {
	//console.log(string);
	let translatedResult = "";
	referenceArray.map((searchstring, idx) => {
		if (searchstring == string) {
			//console.log(translationArray[idx], idx);
			translatedResult = translationArray[idx];
		}
	});
	return translatedResult;
};

fileData.forEach(function (item) {
	item.labels.forEach(function (itemlabel) {
		labelsData.forEach(function (label, idx) {
			label.itemTitle = labelsES[idx];
			if (itemlabel === label.itemValue) {
				label.itemOcurrences += 1;
			}
		});
	});

	item.objects.forEach(function (itemobject) {
		objectsData.forEach(function (object, idx) {
			object.itemTitle = objectsES[idx];
			if (itemobject === object.itemValue) {
				object.itemOcurrences += 1;
			}
		});
	});
});

//console.log(labelsData, objectsData);

fs.writeFileSync("./st_labelsData.json", JSON.stringify(labelsData));
fs.writeFileSync("./st_objectsData.json", JSON.stringify(objectsData));

//contar las ocurrencias de cada label en el archivo de datos

//crear un nuevo objeto de labels con:
// 1. el texto de la label
// 2. la cantidad de ocurrencias
// 3. el texto en español de la label
// 4. guardarlo en un nuevo json
