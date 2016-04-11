import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import EventEditConstants from '../constants/EventEditConstants';
import EventEdit from '../models/eventedit/EventEdit';
import Test from '../models/eventedit/Test';
import Tutor from '../models/eventedit/Tutor';
import Lector from '../models/eventedit/Lector';
import Collaborator from '../models/eventedit/Collaborator';
import {isNumberOrReal} from '../utils/validation/Validation';
//import CollaboratorTest from '../models/eventedit/CollaboratorTest';
import extend from 'extend';
import {find, filter, every} from 'lodash';

let _eventEdit = {};

function loadData(data) {
	_eventEdit = new EventEdit(data);
}

function toggleCheckedAll(container, array, checked, checkedAllKeyName){
	array.forEach(item => {
		item.checked = checked;
	});
	container[checkedAllKeyName] = checked;
}

function toggleChecked(container, array, id, checked, checkedAllKeyName){
	var item = find(array, (item) => {
		return item.id === id;
	});
	if (item){
		item.checked = checked;
	}

	const isEveryCheked = every(array, (item) => {
		return item.checked === true;
	});

	if (isEveryCheked) {
		container[checkedAllKeyName] = true;
	}
	else {
		container[checkedAllKeyName] = false;
	}
}

function sortTable(array, key, isAsc){
	var isAscending = isAsc ? 1 : -1;
	array.sort((first, second) => {
		var firstVal = isNumberOrReal(first[key]) ? Number(first[key]) : first[key];
		var secondVal = isNumberOrReal(second[key]) ? Number(second[key]) : second[key];
		return firstVal > secondVal ? isAscending : firstVal === secondVal ? 0 : -(isAscending);
	});
}

const base = {
	changeName(name){
		_eventEdit.base.name = name;
	},
	changeType(type){
		_eventEdit.base.selectedType = type;
	},
	changeCode(code){
		_eventEdit.base.selectedCode = code;
	},
	changeStartDateTime(dateTime){
		_eventEdit.base.startDateTime = new Date(dateTime);
	},
	changeFinishDateTime(dateTime){
		_eventEdit.base.finishDateTime = new Date(dateTime);
	},
	changeEducationOrg(educationOrgId){
		_eventEdit.base.selectedEducationOrgId = educationOrgId;
	},
	changeEducationMethod(educationMethod){
		_eventEdit.base.selectedEducationMethod = educationMethod;
	},
	changePlace(place){
		_eventEdit.base.places.selectedNode = place;
	}
}

const requests = {
	changeIsDateRequestBeforeBegin(checked){
		_eventEdit.requests.isDateRequestBeforeBegin = checked;
	},
	changeRequestBeginDate(date){
		_eventEdit.requests.requestBeginDate = new Date(date);
	},
	changeRequestOverDate(date){
		_eventEdit.requests.requestOverDate = new Date(date);;
	},
	changeIsAutomaticIncludeInCollaborators(checked){
		_eventEdit.requests.isAutomaticIncludeInCollaborators = checked;
	},
	changeIsApproveByBoss(checked){
		_eventEdit.requests.isApproveByBoss = checked;
	},
	changeIsApproveByTutor(checked){
		_eventEdit.requests.isApproveByTutor = checked;
	},
	sortTable(key, isAsc){
		sortTable(_eventEdit.requests.requestItems, key, isAsc);
	},
	changeRequestStatus(id, status){
		let requestItems = _eventEdit.requests.requestItems;
		let item = find(requestItems, (item) => {
			return item.id === id;
		});
		if (item){
			item.status = status;
		}
	}
}

const collaborators = {
	toggleIsAssist(id, isAssist){
		let _collaborators = _eventEdit.collaborators.collaborators;
		let item = find(_collaborators, (item) => {
			return item.id === id;
		});
		if (item){
			item.isAssist = isAssist;
		}
	},
	sortTable(key, isAsc){
		sortTable(_eventEdit.collaborators.collaborators, key, isAsc);
	},
	toggleCheckedAll(checked){
		var container = _eventEdit.collaborators;
		var arr = _eventEdit.collaborators.collaborators;
		toggleCheckedAll(container, arr, checked, 'checkedAll');
	},
	toggleChecked(id, checked) {
		var container = _eventEdit.collaborators;
		var arr = _eventEdit.collaborators.collaborators;
		toggleChecked(container, arr, id, checked, 'checkedAll');
	},
	removeItems(){
		let _collaborators = _eventEdit.collaborators.collaborators;
		_collaborators = filter(_collaborators, (col) => {
			return !col.checked;
		});
		_eventEdit.collaborators.collaborators = _collaborators;
		_eventEdit.collaborators.checkedAll = false;
	},
	updateItems(items){
		_eventEdit.collaborators.collaborators = items.map((item) => {
			let obj = {...item.data};
			obj.id = item.id;
			return new Collaborator(obj);
		});
		_eventEdit.collaborators.checkedAll = false;
	},
	changeInfoMessage(message, status){
		_eventEdit.collaborators.infoMessage = message;
		_eventEdit.collaborators.infoStatus = status;
	}
}

const tutors = {

	toggleTutorIsMain(id, main){
		let _tutors = _eventEdit.tutors.tutors;
		_tutors.forEach((tutor) => {
			if (tutor.id === id) tutor.main = main;
			else tutor.main = false;
		});
	},
	toggleTutorChecked(id, checked){
		var container = _eventEdit.tutors;
		var arr = _eventEdit.tutors.tutors;
		toggleChecked(container, arr, id, checked, 'checkedAllTutors');
	},
	toggleLectorChecked(id, checked) {
		var container = _eventEdit.tutors;
		var arr = _eventEdit.tutors.lectors;
		toggleChecked(container, arr, id, checked, 'checkedAllLectors');
	},
	sortTutorsTable(key, isAsc){
		sortTable(_eventEdit.tutors.tutors, key, isAsc);
	},
	sortLectorsTable(key, isAsc){
		sortTable(_eventEdit.tutors.lectors, key, isAsc);
	},
	toggleCheckedAllTutors(checked){
		var container = _eventEdit.tutors;
		var arr = _eventEdit.tutors.tutors;
		toggleCheckedAll(container, arr, checked, 'checkedAllTutors');
	},
	toggleCheckedAllLectors(checked){
		var container = _eventEdit.tutors;
		var arr = _eventEdit.tutors.lectors;
		toggleCheckedAll(container, arr, checked, 'checkedAllLectors');
	},
	removeTutors(){
		let _tutors = _eventEdit.tutors.tutors;
		_tutors = filter(_tutors, (t) => {
			return !t.checked;
		});
		_eventEdit.tutors.tutors = _tutors;
		_eventEdit.tutors.checkedAllTutors = false;
	},
	removeLectors(){
		let _lectors = _eventEdit.tutors.lectors;
		_lectors = filter(_lectors, (l) => {
			return !l.checked;
		});
		_eventEdit.tutors.lectors = _lectors;
		_eventEdit.tutors.checkedAllLectors = false;
	},
	updateTutors(tutors){
		_eventEdit.tutors.tutors = tutors.map((item) => {
			let obj = {...item.data};
			obj.id = item.id;
			return new Tutor(obj);
		});
		_eventEdit.tutors.checkedAllTutors = false;
	},
	updateLectors(lectors){
		_eventEdit.tutors.lectors = lectors.map((item) => {
			let obj = {...item.data};
			obj.id = item.id;
			return new Lector(obj);
		});
		_eventEdit.tutors.checkedAllLectors = false;
	}
}

const testing = {
	updatePrevTests(tests){
		_eventEdit.testing.prevTests = tests.map((item) => {
			let obj = {...item.data};
			obj.id = item.id;
			return new Test(obj);
		});
	},

	updatePostTests(tests){
		_eventEdit.testing.postTests = tests.map((item) => {
			let obj = {...item.data};
			obj.id = item.id;
			return new Test(obj);
		});
	},

	changeIsPrevTests(checked){
		_eventEdit.testing.isPrevTests = checked;
	},

	changeIsPostTests(checked){
		_eventEdit.testing.isPostTests = checked;
	},

	removePrevTest(id){
		var tests = _eventEdit.testing.prevTests;
		_eventEdit.testing.prevTests = filter(tests, (item) => {
			return item.id !== id;
		});
	},

	removePostTest(id){
		var tests = _eventEdit.testing.postTests;
		_eventEdit.testing.postTests = filter(tests, (item) => {
			return item.id !== id;
		});
	},

	sortTable(key, isAsc){
		sortTable(_eventEdit.testing.testingList, key, isAsc);
	}
}

const courses = {
	sortTable(key, isAsc){
		sortTable(_eventEdit.courses.courses, key, isAsc);
	}
}

const files = {
	uploadedFiles(files){
		_eventEdit.files.files = _eventEdit.files.files.concat(files);
		_eventEdit.files.isUploading = false;
	},
	removeFile(id){
		var files = _eventEdit.files.files;
		_eventEdit.files.files = filter(files, (file) => {
			return file.id !== id;
		});
	},
	uploadingFiles(){
		_eventEdit.files.isUploading = true;
	}
}



const EventEditStore = extend({}, EventEmitter.prototype, {
	
	getData(){
		return {..._eventEdit};
	},

	getPartialData(key) {
		return {..._eventEdit[key]}
	},

	emitChange() {
		this.emit('change');
	},

	addChangeListener(callBack) {
		this.on('change', callBack);
	},

	removeChangeListener(callBack) {
		this.removeListener('change', callBack);
	}
});

EventEditStore.dispatchToken = AppDispatcher.register((payload) => {
	let action = payload.action;
	let isEmit = false;

	switch(action.actionType) {

		case EventEditConstants.RECEIVE_EVENTEDIT_DATA:
			loadData(action.data);
			isEmit = true;
			break;

		//BASE
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_NAME:
			base.changeName(action.name);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_TYPE:
			base.changeType(action.type);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_CODE:
			base.changeCode(action.code);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_START_DATETIME:
			base.changeStartDateTime(action.dateTime);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_FINISH_DATETIME:
			base.changeFinishDateTime(action.dateTime);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_ORG:
			base.changeEducationOrg(action.educationOrgId);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_METHOD:
			base.changeEducationMethod(action.educationMethod);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_PLACE:
			base.changePlace(action.place);
			isEmit = true;
			break;

		//REQUESTS
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_DATE_REQUEST_BEFORE_BEGIN:
			requests.changeIsDateRequestBeforeBegin(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_BEGIN_DATE:
			requests.changeRequestBeginDate(action.date);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_OVER_DATE:
			requests.changeRequestOverDate(action.date);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_AUTOMATIC_INCLUDE:
			requests.changeIsAutomaticIncludeInCollaborators(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_BOSS:
			requests.changeIsApproveByBoss(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_TUTOR:
			requests.changeIsApproveByTutor(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_SORT_TABLE:
			requests.sortTable(action.key, action.isAsc);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_STATUS:
			requests.changeRequestStatus(action.id, action.status);
			isEmit = true;
			break;

		//COLLABORATORS
		case EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_IS_ASSIST:
			collaborators.toggleIsAssist(action.id, action.isAssist);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_SORT_TABLE:
			collaborators.sortTable(action.key, action.isAsc);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_ALL:
			collaborators.toggleCheckedAll(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED:
			collaborators.toggleChecked(action.id, action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_REMOVE_ITEMS:
			collaborators.removeItems();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE:
			collaborators.changeInfoMessage(action.infoMesage, action.infoStatus);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_UPDATE_ITEMS:
			collaborators.updateItems(action.items);
			isEmit = true;
			break;

		//TUTORS
		case EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_TUTOR_IS_MAIN:
			tutors.toggleTutorIsMain(action.id, action.main);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_TUTOR_CHECKED:
			tutors.toggleTutorChecked(action.id, action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_LECTOR_CHECKED:
			tutors.toggleLectorChecked(action.id, action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_SORT_TUTORS_TABLE:
			tutors.sortTutorsTable(action.key, action.isAsc);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_SORT_LECTORS_TABLE:
			tutors.sortLectorsTable(action.key, action.isAsc);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_TUTORS:
			tutors.toggleCheckedAllTutors(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_LECTORS:
			tutors.toggleCheckedAllLectors(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_REMOVE_TUTORS:
			tutors.removeTutors();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_REMOVE_LECTORS:
			tutors.removeLectors();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_UPDATE_TUTORS:
			tutors.updateTutors(action.tutors);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_UPDATE_LECTORS:
			tutors.updateLectors(action.lectors);
			isEmit = true;
			break;

		//testing
		case EventEditConstants.EVENTEDIT_TESTING_UPDATE_PREV_TESTS:
			testing.updatePrevTests(action.tests);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_UPDATE_POST_TESTS:
			testing.updatePostTests(action.tests);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_CHANGE_IS_PREV_TESTS:
			testing.changeIsPrevTests(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_CHANGE_IS_POST_TESTS:
			testing.changeIsPostTests(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_REMOVE_PREV_TEST:
			testing.removePrevTest(action.id);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_REMOVE_POST_TEST:
			testing.removePostTest(action.id);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_SORT_TABLE:
			testing.sortTable(action.key, action.isAsc);
			isEmit = true;
			break;

		//COURSES
		case EventEditConstants.EVENTEDIT_COURSES_SORT_TABLE:
			courses.sortTable(action.key, action.isAsc);
			isEmit = true;
			break;

		//FILES
		case EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILES:
			files.uploadingFiles();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_UPLOADED_FILES:
			files.uploadedFiles(action.files);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_REMOVE_FILE:
			files.removeFile(action.id);
			isEmit = true;
			break;			
		default:
			return true;
	}

	if (isEmit) EventEditStore.emitChange();
	return true;
});
export default EventEditStore;
