import keyMirror from 'keyMirror';
import toArrayKeys from '../toArrayKeys';

export default {

	keys: keyMirror({
		CITILINK: null,
		MERLION: null,
		ASSESSMENT: null
	}),

	toArray: function() {
		return toArrayKeys(this.keys);
	}
};