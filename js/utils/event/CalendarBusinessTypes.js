var keyMirror = require('keyMirror');

module.exports = {

	values: {
		ALL: 'Все типы',
		CITILINK: 'CITILINK',
		MERLION: 'MERLION'
	},

	keys: keyMirror({
		ALL: null,
		CITILINK: null,
		MERLION: null
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