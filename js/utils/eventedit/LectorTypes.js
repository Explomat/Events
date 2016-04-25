import keyMirror from 'keyMirror';

export default {

	values: {
		collaborator: 'Внутренний',
		invitee: 'Внешний'
	},

	keys: keyMirror({
		collaborator: null,
		invitee: null
	})
};