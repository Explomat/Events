import toArrayKeys from '../toArrayKeys';
import keyMirror from 'keyMirror';

export default {

	values: {
		collaborator: 'Внутренний',
		invitee: 'Внешний'
	},

	keys: keyMirror({
		collaborator: null,
		invitee: null
	}),

	toArray: function() {
		return toArrayKeys(this.values);
	}
};