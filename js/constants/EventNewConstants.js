var keyMirror = require('keyMirror');

module.exports = keyMirror({
	EVENT_NEW_RECEIVE_DATA: null,
	EVENT_NEW_DISPOSE_DATA: null,
	
	//BASE
	EVENT_NEW_CHANGE_NAME: null,
	EVENT_NEW_CHANGE_TYPE: null,
	EVENT_NEW_CHANGE_CODE: null,
	EVENT_NEW_CHANGE_EDUCATION_ORG: null,
	EVENT_NEW_SELECT_EDUCATION_METHOD: null,
	EVENT_NEW_SELECT_TUTOR: null,
	EVENT_NEW_CHANGE_MAX_PERSON_NUM: null,

	//PLACE&DATETIME
	EVENT_NEW_CHANGE_START_DATE_TIME: null,
	EVENT_NEW_CHANGE_START_FINISH_TIME: null,
	EVENT_NEW_SELECT_PLACE: null,

	//TUTORS
	EVENT_NEW_SELECT_LECTOR_TYPE: null,
	EVENT_NEW_SELECT_ADD_LECTOR_TYPE: null,
	EVENT_NEW_SELECT_SEARCH_LECTOR_TYPE: null,
	EVENT_NEW_SELECT_INNER_LIST_LECTOR: null,
	EVENT_NEW_SELECT_INNER_NEW_LECTOR: null,
	EVENT_NEW_SELECT_OUTER_LIST_LECTOR: null,
	EVENT_NEW_CHANGE_LECTOR_FIRST_NAME: null,
	EVENT_NEW_CHANGE_LECTOR_LAST_NAME: null,
	EVENT_NEW_CHANGE_LECTOR_MIDDLE_NAME: null,
	EVENT_NEW_CHANGE_LECTOR_EMAIL: null,
	EVENT_NEW_CHANGE_LECTOR_COMPANY: null
});