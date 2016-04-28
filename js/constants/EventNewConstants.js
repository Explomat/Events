var keyMirror = require('keyMirror');

module.exports = keyMirror({
	EVENT_NEW_RECEIVE_DATA: null,

	//BASE
	EVENT_NEW_CHANGE_NAME: null,
	EVENT_NEW_CHANGE_TYPE: null,
	EVENT_NEW_CHANGE_CODE: null,
	EVENT_NEW_CHANGE_EDUCATION_ORG: null,

	//DATETIME
	EVENT_NEW_CHANGE_START_DATE_TIME: null,
	EVENT_NEW_CHANGE_START_FINISH_TIME: null,

	//PLACE
	EVENT_NEW_GET_PLACES: null,
	EVENT_NEW_SELECT_PLACE: null
});