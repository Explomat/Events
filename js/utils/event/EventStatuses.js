import keyMirror from 'keyMirror';
import toArrayKeys from '../toArrayKeys';

module.exports =  {

	values: {
		close: 'Завершено',
		active: 'Проводится',
		plan: 'Планируется',
		cancel: 'Отменено'
	},

	keys: keyMirror({
		close: null,
		active: null,
		plan: null,
		cancel: null
	}),

	toArray: function() {
		return toArrayKeys(this.values);
	}
};