var keyMirror = require('keyMirror');

module.exports = {

	values: {
		all: 'Все',
		close: 'Завершено',
		active: 'Проводится',
		plan: 'Планируется'
	},

	keys: keyMirror({
		all: null,
		close: null,
		active: null,
		plan: null
	}),

	toArray: function () {
		return Object.keys(this.values).map(function(s){
			return {
				payload: s,
				text: this.values[s]
			}
		}.bind(this))
	}
};