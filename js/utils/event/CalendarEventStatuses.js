import keyMirror from 'keyMirror';
import toArrayKeys from '../toArrayKeys';

module.exports = {

	values: {
		all: 'Все статусы',
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

	toArray: function() {
		return toArrayKeys(this.values);
	}
};