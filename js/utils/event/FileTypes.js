var keyMirror = require('keyMirror');

module.exports = {

	keys: keyMirror({
		excel: null,
		word: null,
		pdf: null,
		pptx: null,
		unknown: null
	}),

	values: {
		excel: 'fa fa-file-excel-o',
		word: 'fa fa-file-word-o',
		pdf: 'fa fa-file-pdf-o',
		pptx: 'fa fa-file-powerpoint-o',
		unknown: 'fa fa-file'
	}
}


