import keyMirror from 'keyMirror';
import toArrayKeys from '../toArrayKeys';

export default {

	values: {
		close: 'Завершено',
		active: 'Проводится',
		plan: 'Планируется'
	},

	keys: keyMirror({
		close: null,
		active: null,
		plan: null
	}),

	toArray: function() {
		return toArrayKeys(this.values);
	}
};