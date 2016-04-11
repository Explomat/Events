var keyMirror = require('keyMirror');

module.exports = keyMirror({
	RECEIVE_EVENTEDIT_DATA: null,

	//BASE
	EVENTEDIT_BASE_CHANGE_NAME: null,
	EVENTEDIT_BASE_CHANGE_TYPE: null,
	EVENTEDIT_BASE_CHANGE_CODE: null,
	EVENTEDIT_BASE_CHANGE_START_DATETIME: null,
	EVENTEDIT_BASE_CHANGE_FINISH_DATETIME: null,
	EVENTEDIT_BASE_CHANGE_EDUCATION_ORG: null,
	EVENTEDIT_BASE_CHANGE_EDUCATION_METHOD: null,
	EVENTEDIT_BASE_CHANGE_PLACE: null,

	//REQUESTS
	EVENTEDIT_REQUESTS_CHANGE_IS_DATE_REQUEST_BEFORE_BEGIN: null,
	EVENTEDIT_REQUESTS_CHANGE_REQUEST_BEGIN_DATE: null,
	EVENTEDIT_REQUESTS_CHANGE_REQUEST_OVER_DATE: null,
	EVENTEDIT_REQUESTS_CHANGE_IS_AUTOMATIC_INCLUDE: null,
	EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_BOSS: null,
	EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_TUTOR: null,
	EVENTEDIT_REQUESTS_SORT_TABLE: null,
	EVENTEDIT_REQUESTS_CHANGE_STATUS: null,

	//COLLABORATORS
	EVENTEDIT_COLLABORATORS_TOGGLE_IS_ASSIST: null,
	EVENTEDIT_COLLABORATORS_SORT_TABLE: null,
	EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_ALL: null,
	EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED: null,
	EVENTEDIT_COLLABORATORS_REMOVE_ITEMS: null,
	EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE: null,
	EVENTEDIT_COLLABORATORS_UPDATE_ITEMS: null,

	//TUTORS
	EVENTEDIT_TUTORS_TOGGLE_TUTOR_IS_MAIN: null,
	EVENTEDIT_TUTORS_TOGGLE_TUTOR_CHECKED: null,
	EVENTEDIT_TUTORS_TOGGLE_LECTOR_CHECKED: null,
	EVENTEDIT_TUTORS_SORT_TUTORS_TABLE: null,
	EVENTEDIT_TUTORS_SORT_LECTORS_TABLE: null,
	EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_TUTORS: null,
	EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_LECTORS: null,
	EVENTEDIT_TUTORS_REMOVE_TUTORS: null,
	EVENTEDIT_TUTORS_REMOVE_LECTORS: null,
	EVENTEDIT_TUTORS_UPDATE_TUTORS: null,
	EVENTEDIT_TUTORS_UPDATE_LECTORS: null,

	//TESTING
	EVENTEDIT_TESTING_UPDATE_PREV_TESTS: null,
	EVENTEDIT_TESTING_UPDATE_POST_TESTS: null,
	EVENTEDIT_TESTING_CHANGE_IS_PREV_TESTS: null,
	EVENTEDIT_TESTING_CHANGE_IS_POST_TESTS: null,
	EVENTEDIT_TESTING_REMOVE_PREV_TEST: null,
	EVENTEDIT_TESTING_REMOVE_POST_TEST: null,
	EVENTEDIT_TESTING_SORT_TABLE: null,

	//COURSES
	EVENTEDIT_COURSES_SORT_TABLE: null,

	//FILES
	EVENTEDIT_FILES_UPLOADING_FILES: null,
	EVENTEDIT_FILES_UPLOADING_FILES_ERROR: null,
	EVENTEDIT_FILES_UPLOADED_FILES: null,
	EVENTEDIT_FILES_REMOVE_FILE: null,
	EVENTEDIT_FILES_REMOVE_FILE_ERROR: null
});