const fs = require('fs');
const _ = require('lodash');
const shuffleSeed = require('shuffle-seed');

function extractColumns(data, columnNames) {
	const headers = _.first(data);

	//compare first row headers of data with column names to decide the index of each column
	//_.pullAt removes elements from array corresponding to indexes and returns an array of removed elements.
	const indexes = _.map(columnNames, column => headers.indexOf(column));
	const extracted = _.map(data, row => _.pullAt(row, indexes));

	return extracted;
}

function loadCSV (
	filename, 
	{ 
		converters = {}, 
		dataColumns = [], 
		labelColumns = [],
		shuffle = true,
		splitTest = false
	}
	) {
	let data = fs.readFileSync(filename, { encoding: 'utf-8' });
	data = data.split('\n').map(row => row.split(','));
	data = data.map(row => _.dropRightWhile(row, val => val === ''));
	const headers = _.first(data);

	data = data.map((row, index) => {
		if (index === 0) {
			return row;
		}

		return row.map((element, index) => {
			if (converters[headers[index]]) {
				const converted = converters[headers[index]](element); //takes boolean TRUE and FALSE values
				return _.isNaN(converted) ? element : converted; 
			}


			const result = parseFloat(element); //changes strings to actual number values
			return _.isNaN(result) ? element : result;
		});
	});

	let labels = extractColumns(data, labelColumns);
	data = extractColumns(data, dataColumns);

	data.shift();
	labels.shift();

	if (shuffle) {
		data = shuffleSeed.shuffle(data, 'phrase');
		labels = shuffleSeed.shuffle(labels, 'phrase');
	}

	if(splitTest) {
		const trainSize = _.isNumber(splitTest) 
		? splitTest 
		: Math.floor(data.length / 2);

		return {
			features: data.slice(trainSize),
			labels: labels.slice(trainSize),
			testFeatures: data.slice(trainSize),
			testLabels: labels.slice(trainSize)
		}; 

	} else {
		return { features: data, labels };
	}

	console.log(data);
}

const { features, labels, testFeatures, testLabels } = loadCSV('data.csv', {
	dataColumns: ['height', 'value'],
	labelColumns: ['passed'],
	shuffle: true,
	splitTest: 1,
	converters: {
		passed: val => (val === 'TRUE' ? 1 : 0)
	}

});

console.log('Features', features);
console.log('Labels', labels);
console.log('testFeatures', testFeatures);
console.log('testLabels', testLabels);

/*
Lodash dropRightWhile creates a slice of array excluding elements dropped from the end. Elements are dropped until predicate returns falsey. The predicate is invoked with three arguments: (value, index, array).
 */