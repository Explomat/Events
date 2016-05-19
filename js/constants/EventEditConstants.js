var keyMirror = require('keyMirror');

module.exports = keyMirror({
	RECEIVE_EVENTEDIT_DATA: null,
	EVENTEDIT_DISPOSE_DATA: null,
	EVENTEDIT_CHANGE_INFO_MESSAGE: null,
	EVENTEDIT_CHANGE_STATUS: null,

	//BASE
	EVENTEDIT_BASE_CHANGE_NAME: null,
	EVENTEDIT_BASE_CHANGE_TYPE: null,
	EVENTEDIT_BASE_CHANGE_CODE: null,
	EVENTEDIT_BASE_CHANGE_START_DATETIME: null,
	EVENTEDIT_BASE_CHANGE_FINISH_DATETIME: null,
	EVENTEDIT_BASE_CHANGE_EDUCATION_ORG: null,
	EVENTEDIT_BASE_CHANGE_EDUCATION_METHOD: null,
	EVENTEDIT_BASE_CHANGE_PLACE: null,
	EVENTEDIT_BASE_CHANGE_MAX_PERSON_NUM: null,

	//REQUESTS
	EVENTEDIT_REQUESTS_CHANGE_IS_OPEN: null,
	EVENTEDIT_REQUESTS_CHANGE_REQUEST_BEGIN_DATE: null,
	EVENTEDIT_REQUESTS_CHANGE_REQUEST_OVER_DATE: null,
	EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_BOSS: null,
	EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_TUTOR: null,
	EVENTEDIT_REQUESTS_SORT_TABLE: null,
	EVENTEDIT_REQUESTS_CHANGE_STATUS: null,

	//COLLABORATORS
	EVENTEDIT_COLLABORATORS_TOGGLE_IS_ASSIST: null,
	EVENTEDIT_COLLABORATORS_SORT_TABLE: null,
	EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_ALL: null,
	EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED: null,
	EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_CONDITIONS: null,
	EVENTEDIT_COLLABORATORS_REMOVE_ITEMS: null,
	EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE: null,
	EVENTEDIT_COLLABORATORS_UPDATE_ITEMS: null,

	//TUTORS
	EVENTEDIT_TUTORS_TOGGLE_TUTOR_IS_MAIN: null,
	EVENTEDIT_TUTORS_TOGGLE_TUTOR_CHECKED: null,
	EVENTEDIT_TUTORS_TOGGLE_LECTOR_CHECKED: null,
	EVENTEDIT_TUTORS_SORT_TUTORS_TABLE: null,
	EVENTEDIT_TUTORS_SORT_LECTORS_TABLE: null,
	EVENTEDIT_TUTORS_TOGGLE_CHECKED_TUTORS_CONDITIONS: null,
	EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_TUTORS: null,
	EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_LECTORS: null,
	EVENTEDIT_TUTORS_REMOVE_TUTORS: null,
	EVENTEDIT_TUTORS_REMOVE_LECTORS: null,
	EVENTEDIT_TUTORS_UPDATE_TUTORS: null,
	EVENTEDIT_TUTORS_UPDATE_LECTORS: null,
	EVENTEDIT_TUTORS_UPDATE_INNER_LECTORS: null,
	EVENTEDIT_TUTORS_CREATE_LECTOR: null,
	EVENTEDIT_TUTORS_SELECT_LECTOR_TYPE: null,

	//TESTING
	EVENTEDIT_TESTING_SELECT_TEST_TYPES: null,
	EVENTEDIT_TESTING_UPDATE_TESTS: null,
	EVENTEDIT_TESTING_TOGGLE_CHECKED: null,
	EVENTEDIT_TESTING_TOGGLE_CHECKED_ALL: null,
	EVENTEDIT_TESTING_REMOVE_TESTS: null,
	EVENTEDIT_TESTING_SORT_TESTING_LIST: null,
	EVENTEDIT_TESTING_SORT_ALL_TESTS: null,

	//COURSES
	EVENTEDIT_COURSES_SORT_TABLE: null,

	//FILES
	EVENTEDIT_FILES_TOGGLE_FILE_IS_ALLOW_DOWNLOAD: null,
	EVENTEDIT_FILES_TOGGLE_CHECKED_ALL_FILES: null,
	EVENTEDIT_FILES_TOGGLE_CHECKED_ALL_LIBRARY_MATERIALS: null,
	EVENTEDIT_FILES_TOGGLE_CHECKED_FILE: null,
	EVENTEDIT_FILES_TOGGLE_CHECKED_LIBRARY_MATERIAL: null,
	EVENTEDIT_FILES_UPLOADING_FILES: null,
	EVENTEDIT_FILES_UPLOADING_FILES_ERROR: null,
	EVENTEDIT_FILES_UPLOADED_FILES: null,
	EVENTEDIT_FILES_UPLOADING_LIBRARY_MATERIALS: null,
	EVENTEDIT_FILES_UPLOADED_LIBRARY_MATERIALS: null,
	EVENTEDIT_FILES_UPLOADING_LIBRARY_MATERIALS_ERROR: null,
	EVENTEDIT_FILES_REMOVE_FILES: null,
	EVENTEDIT_FILES_REMOVE_FILES_ERROR: null,
	EVENTEDIT_FILES_UPDATE_FILES: null,
	EVENTEDIT_FILES_UPDATE_LIBRARY_MATERIALS: null,
	EVENTEDIT_FILES_CHANGE_INFO_MESSAGE_LIBRARY_MATERIALS: null
});