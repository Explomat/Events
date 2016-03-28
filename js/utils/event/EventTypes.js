import keyMirror from 'keyMirror';
import toArrayKeys from '../toArrayKeys';

export default {
	values: {
		full_time: 'Очное',
		webinar: 'Вебинар'
	},

	keys: keyMirror({
		full_time: null,
		webinar: null
	}),

	toArray: function() {
		return toArrayKeys(this.values);
	}
};