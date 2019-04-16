const fs = require('fs');
const _ = require('lodash');
const shuffleSeed = require('shuffle-seed');

// function to look at the data array and pick out the column names
function extractColumns(data, columnNames) {
	const headers = _.first(data);

	//compare first row headers of data with column names to decide the index of each column
	//_.pullAt removes elements from array corresponding to indexes and returns an array of removed elements.
	const indexes = _.map(columnNames, column => headers.indexOf(column));
	const extracted = _.map(data, row => _.pullAt(row, indexes));

	return extracted;
}

/* function loadCSV takes 2 arguments: filename (a .csv file) and an array of options.
It creates a variable data that uses the fs readFileSync function to return the contents of the path with utf-8 encoding.
It splits the data on each new line to get an array of strings (one string per row).
The map function then splits the rows on the ','. The data variable is overwritten each time.
Then a lodash function dropRightWhile() is used to drop emty strings.
A variable headers is created using the Lodash function that takes just the first row. 
*/
function loadCSV (
	filename, 
	{ 
		converters = {}, // used to convert 'TRUE' to boolean true etc.
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

	// main mapping statement, first row is skipped over, 
	data = data.map((row, index) => {
		if (index === 0) {
			return row;
		}
		// 
		return row.map((element, index) => {

			// if there is a converters function then use function to return 'converted'
			if (converters[headers[index]]) {
				const converted = converters[headers[index]](element); // takes boolean TRUE and FALSE values
				return _.isNaN(converted) ? element : converted; // if not a number return element
			}

			// parseFloat returns the element and returns a floating point number. 
			const result = parseFloat(element); // changes strings to actual number values
			return _.isNaN(result) ? element : result;
		});
	});

	let labels = extractColumns(data, labelColumns);
	data = extractColumns(data, dataColumns);

	data.shift();
	labels.shift();

	// if shuffle option set to true then use shuffleseed to shuffle data
	if (shuffle) {
		data = shuffleSeed.shuffle(data, 'phrase');
		labels = shuffleSeed.shuffle(labels, 'phrase');
	}

	// if this option is set to true (because a reduced training set is required for example) then create a training set
	// based on the splitTest size, or just divide set in 2. 
	if(splitTest) {
		const trainSize = _.isNumber(splitTest) 
		? splitTest 
		: Math.floor(data.length / 2);

		// use trainsize to slice data
		return {
			features: data.slice(trainSize),
			labels: labels.slice(trainSize),
			testFeatures: data.slice(trainSize),
			testLabels: labels.slice(trainSize)
		}; 

	} else {
		return { features: data, labels };
	}

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

/*Notes
Lodash dropRightWhile creates a slice of array excluding elements dropped from the end. 
Elements are dropped until predicate returns falsey. 
The predicate is invoked with three arguments: (value, index, array).
 */

/*example options argument: property converters 
	loadCSV('data.csv', {
		converters: {
			// passed: val => val === 'TRUE' // returns boolean true or false
			passed: val => val === 'TRUE' ? 1 : 0
		}
	})
*/