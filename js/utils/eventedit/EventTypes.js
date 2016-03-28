import keyMirror from 'keyMirror';
import toArrayKeys from '../toArrayKeys';

export default {
	values: {
		education_method: 'Учебная программа',
		one_time: 'Разовое мероприятие',
		webinar: 'Вебинар'
	},

	keys: keyMirror({
		education_method: null,
		one_time: null,
		webinar: null
	}),

	toArray: function() {
		return toArrayKeys(this.values);
	}
};