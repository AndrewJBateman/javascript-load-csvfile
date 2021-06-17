# :zap: Javascript Load CSV File

* Code to learn to load a Comma Separated Values (CSV) file and manipulate its data.
* **Note:** to open web links in a new window use: _ctrl+click on link_

![GitHub repo size](https://img.shields.io/github/repo-size/AndrewJBateman/javascript-load-csvfile?style=plastic)
![GitHub pull requests](https://img.shields.io/github/issues-pr/AndrewJBateman/javascript-load-csvfile?style=plastic)
![GitHub Repo stars](https://img.shields.io/github/stars/AndrewJBateman/javascript-load-csvfile?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/AndrewJBateman/javascript-load-csvfile?style=plastic)

## :page_facing_up: Table of contents

* [:zap: Javascript Load CSV File](#zap-javascript-load-csv-file)
  * [:page_facing_up: Table of contents](#page_facing_up-table-of-contents)
  * [:books: General info](#books-general-info)
  * [:camera: Screenshots](#camera-screenshots)
  * [:signal_strength: Technologies](#signal_strength-technologies)
  * [:floppy_disk: Setup](#floppy_disk-setup)
  * [:computer: Code Examples](#computer-code-examples)
  * [:cool: Features](#cool-features)
  * [Status & To-Do List](#status--to-do-list)
  * [:clap: Inspiration](#clap-inspiration)
  * [:file_folder: License](#file_folder-license)
  * [:envelope: Contact](#envelope-contact)

## :books: General info

* Part of a Udemy Machine Learning/Tensorflow course to understand the mathematics and programming techniques that are used in the most common Machine Learning algorithms.

## :camera: Screenshots

![Example screenshot](./img/data-console-log.png).

## :signal_strength: Technologies

* [node.js v14](https://nodejs.org).
* [Lodash v4](https://lodash.com/) Javascript utility library.
* [shuffle-seed v1ºx](https://www.npmjs.com/package/shuffle-seed) a Nodejs module to Shuffle an Array of records by adding a seed phrase.

## :floppy_disk: Setup

* Use 'node load-csv.js' in terminal to see console.logs or run functions.

## :computer: Code Examples

```javascript
// main mapping statement, first row is skipped over,
data = data.map((row, index) => {
	if (index === 0) {
		return row
	}
	//
	return row.map((element, index) => {
		// if there is a converters function then use function to return 'converted'
		if (converters[headers[index]]) {
			const converted = converters[headers[index]](element) // takes boolean TRUE and FALSE values
			return _.isNaN(converted) ? element : converted // if not a number return element
		}

		// parseFloat returns the element and returns a floating point number.
		const result = parseFloat(element) // changes strings to actual number values
		return _.isNaN(result) ? element : result
	})
})
```

## :cool: Features

* options can be changed

## Status & To-Do List

* Status: Working.
* To-Do: Try a more complex CSV data set.

## :clap: Inspiration

* [Udemy Course: Machine Learning With Javascript, Appendix Section 14](https://www.udemy.com/machine-learning-with-javascript/learn/v4/content)

## :file_folder: License

* N/A

## :envelope: Contact

* Repo created by [ABateman](https://github.com/AndrewJBateman), email: gomezbateman@yahoo.com
