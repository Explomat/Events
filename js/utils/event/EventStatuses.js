var keyMirror = require('keyMirror');

module.exports = {

	values: {
		close: 'Завершено',
		active: 'Проводится',
		plan: 'Планируется'
	},

	keys: keyMirror({
		close: null,
		active: null,
		plan: null
	})
};