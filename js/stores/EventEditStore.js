import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import EventEditConstants from '../constants/EventEditConstants';
import EventEdit from '../models/eventedit/EventEdit';
import Test from '../models/eventedit/Test';
import Tutor from '../models/eventedit/Tutor';
import Lector from '../models/eventedit/Lector';
import Collaborator from '../models/eventedit/Collaborator';
import File from '../models/eventedit/File';
import LibraryMaterial from '../models/eventedit/LibraryMaterial';
import LectorTypes from '../utils/eventedit/LectorTypes';
import {isNumberOrReal} from '../utils/validation/Validation';
//import CollaboratorTest from '../models/eventedit/CollaboratorTest';
import extend from 'extend';
import {find, filter, every, keys, differenceWith} from 'lodash';
import {expand} from '../utils/Object';

var _eventEdit = {};

function loadData(data) {
	_eventEdit = new EventEdit(data);
}

function changeInfoMessage(message, status){
	_eventEdit.infoMessage = message;
	_eventEdit.infoStatus = status;
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
		var finishDateTime = _eventEdit.base.finishDateTime;
		var startDateTime = new Date(dateTime);
		_eventEdit.base.startDateTime = startDateTime;

		if (startDateTime > finishDateTime) {
			_eventEdit.base.finishDateTime = startDateTime;
		}
	},
	changeFinishDateTime(dateTime){
		var startDateTime = _eventEdit.base.startDateTime;
		var finishDateTime = new Date(dateTime);
		_eventEdit.base.finishDateTime = finishDateTime;

		if (finishDateTime < startDateTime) {
			_eventEdit.base.startDateTime = finishDateTime;
		}
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
	changeIsOpen(checked){
		_eventEdit.requests.isOpen = checked;
		if (checked) {
			_eventEdit.requests.isApproveByBoss = false;
			_eventEdit.requests.isApproveByTutor = false;
		}
	},
	changeRequestBeginDate(dateTime){
		var startDateTime = _eventEdit.base.startDateTime;
		var requestOverDate = _eventEdit.requests.requestOverDate;
		var requestBeginDate = new Date(dateTime);
		_eventEdit.requests.requestBeginDate = requestBeginDate;

		if (requestBeginDate > startDateTime) {
			_eventEdit.requests.requestBeginDate = startDateTime;
			requestBeginDate = startDateTime;
		}
		if (requestBeginDate > requestOverDate) {
			_eventEdit.requests.requestOverDate = requestBeginDate;
		}
	},
	changeRequestOverDate(dateTime){
		var startDateTime = _eventEdit.base.startDateTime;
		var requestBeginDate = _eventEdit.requests.requestBeginDate;
		var requestOverDate = new Date(dateTime);
		_eventEdit.requests.requestOverDate = requestOverDate;

		if (requestOverDate > startDateTime) {
			_eventEdit.requests.requestOverDate = startDateTime;
			requestOverDate = startDateTime;
		}
		if (requestOverDate < requestBeginDate) {
			_eventEdit.requests.requestBeginDate = requestOverDate;
		}
	},
	changeIsApproveByBoss(checked){
		_eventEdit.requests.isApproveByBoss = checked;
		if (checked){
			_eventEdit.requests.isOpen = false;
		}
	},
	changeIsApproveByTutor(checked){
		_eventEdit.requests.isApproveByTutor = checked;
		if (checked){
			_eventEdit.requests.isOpen = false;
		}
	},
	sortTable(payload){
		var data = JSON.parse(payload);
		var isAsc = data.isAsc === 'true';
		sortTable(_eventEdit.requests.requestItems, data.key, isAsc);
		_eventEdit.requests.selectedPayload = payload;
	},
	changeRequestStatus(id, status){
		var requestItems = _eventEdit.requests.requestItems;
		var item = find(requestItems, (item) => {
			return item.id === id;
		});
		if (item){
			item.status = status;
		}
	}
}

const collaborators = {
	toggleIsAssist(id, isAssist){
		var _collaborators = _eventEdit.collaborators.collaborators;
		var item = find(_collaborators, (item) => {
			return item.id === id;
		});
		if (item){
			item.isAssist = isAssist;
		}
	},
	sortTable(payload){
		var data = JSON.parse(payload);
		var isAsc = data.isAsc === 'true';
		sortTable(_eventEdit.collaborators.collaborators, data.key, isAsc);
		_eventEdit.collaborators.selectedPayload = payload;
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
	toggleCheckedConditions(payload){
		var data = JSON.parse(payload, (key, value) => {
			return value === 'true' ? true : value === 'false' ? false : value;
		});
		var arr = _eventEdit.collaborators.collaborators;
		arr.forEach(item => {
			var isHas = every(keys(data), (key) => {
				return data[key] === item[key];
			});
			item.checked = isHas;
		});
		const isEveryCheked = every(arr, (item) => {
			return item.checked === true;
		});
		_eventEdit.collaborators.checkedAll = isEveryCheked;

	},
	removeItems(){
		var _collaborators = _eventEdit.collaborators.collaborators;
		_collaborators = filter(_collaborators, (col) => {
			return !col.checked;
		});
		_eventEdit.collaborators.collaborators = _collaborators;
		_eventEdit.collaborators.checkedAll = false;
	},
	updateItems(items){
		_eventEdit.collaborators.collaborators = items.map((item) => {
			var collaborator = expand(item, (value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
			return new Collaborator(collaborator);
		});
		_eventEdit.collaborators.checkedAll = false;
	},
	changeInfoMessage(message, status){
		_eventEdit.collaborators.infoMessage = message;
		_eventEdit.collaborators.infoStatus = status;
	}
}

const tutors = {

	toggleTutorIsMain(id){
		var _tutors = _eventEdit.tutors.tutors;
		_tutors.forEach((tutor) => {
			if (tutor.id === id) {
				tutor.main = true;
			}
			else {
				tutor.main = false;
			}
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
	sortTutorsTable(payload){
		var data = JSON.parse(payload);
		var isAsc = data.isAsc === 'true';
		sortTable(_eventEdit.tutors.tutors, data.key, isAsc);
		_eventEdit.tutors.selectedTutorPayload = payload;
	},
	sortLectorsTable(payload){
		var data = JSON.parse(payload);
		var isAsc = data.isAsc === 'true';
		sortTable(_eventEdit.tutors.lectors, data.key, isAsc);
		_eventEdit.tutors.selectedLectorPayload = payload;
	},
	toggleCheckedTutorsConditions(payload){
		var data = JSON.parse(payload, (key, value) => {
			return value === 'true' ? true : value === 'false' ? false : value;
		});
		var arr = _eventEdit.tutors.tutors;
		arr.forEach(item => {
			var isHas = every(keys(data), (key) => {
				return data[key] === item[key];
			});
			item.checked = isHas;
		});
		const isEveryCheked = every(arr, (item) => {
			return item.checked === true;
		});
		_eventEdit.tutors.checkedAllTutors = isEveryCheked;
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
		var _tutors = _eventEdit.tutors.tutors;
		_tutors = filter(_tutors, (t) => {
			return !t.checked;
		});
		_eventEdit.tutors.tutors = _tutors;
		_eventEdit.tutors.checkedAllTutors = false;
	},
	removeLectors(){
		var _lectors = _eventEdit.tutors.lectors;
		_lectors = filter(_lectors, (l) => {
			return !l.checked;
		});
		_eventEdit.tutors.lectors = _lectors;
		_eventEdit.tutors.checkedAllLectors = false;
	},
	updateTutors(tutors){
		_eventEdit.tutors.tutors = tutors.map((item) => {
			var tutor = expand(item, (value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
			return new Tutor(tutor);
		});
		var isEveryNotMain = every(_eventEdit.tutors.tutors, (t) => {
			return t.main === false;
		});
		if (isEveryNotMain && _eventEdit.tutors.tutors.length > 0) {
			_eventEdit.tutors.tutors[0].main = true;
		}
		_eventEdit.tutors.checkedAllTutors = false;
	},
	updateLectors(lectors){
		_eventEdit.tutors.lectors = lectors.map((item) => {
			var lector = expand(item, (value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
			var names = lector.fullname.split(' ');
			lector.firstName = names[0];
			lector.lastName = names[1];
			lector.middleName = names[2];
			return new Lector(lector);
		});
		_eventEdit.tutors.checkedAllLectors = false;
	},
	updateInnerLectors(lectors){
		_eventEdit.tutors.lectors = lectors.map((item) => {
			var lector = expand(item, (value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
			var names = lector.fullname.split(' ');
			lector.firstName = names[0];
			lector.lastName = names[1];
			lector.middleName = names[2];
			lector.type = LectorTypes.keys.collaborator;
			return new Lector(lector);
		});
		_eventEdit.tutors.checkedAllLectors = false;
	},
	createLector(_lector){
		var lector = new Lector(_lector);
		lector.type = LectorTypes.keys.invitee;
		lector.isNew = true;
		_eventEdit.tutors.lectors.push(lector);
	},
	selectLectorType(payload){
		var data = JSON.parse(payload, (key, value) => {
			return value === 'true' ? true : value === 'false' ? false : value;
		});
		var arr = _eventEdit.tutors.lectors;
		arr.forEach(item => {
			var isHas = every(keys(data), (key) => {
				return data[key] === item[key];
			});
			item.checked = isHas;
		});
		const isEveryCheked = every(arr, (item) => {
			return item.checked === true;
		});
		_eventEdit.tutors.checkedAllLectors = isEveryCheked;
	}
}

const testing = {

	selectTestTypes(payload){
		var data = JSON.parse(payload, (key, value) => {
			return value === 'true' ? true : value === 'false' ? false : value;
		});
		var arr = _eventEdit.testing.allTests;
		arr.forEach(item => {
			var isHas = every(keys(data), (key) => {
				return data[key] === item[key];
			});
			item.checked = isHas;
		});
		const isEveryCheked = every(arr, (item) => {
			return item.checked === true;
		});
		_eventEdit.testing.checkedAll = isEveryCheked;
	},

	updateTests(tests, type){
		_eventEdit.testing.allTests = tests.map((item) => {
			var test = expand(item, (value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
			test.type = test.type && test.type !== type ? test.type : type;
			return new Test(test);
		});
		_eventEdit.testing.checkedAll = false;
	},

	toggleChecked(id, checked){
		var container = _eventEdit.testing;
		var arr = _eventEdit.testing.allTests;
		toggleChecked(container, arr, id, checked, 'checkedAll');
	},

	toggleCheckedAll(checked){
		var container = _eventEdit.testing;
		var arr = _eventEdit.testing.allTests;
		toggleCheckedAll(container, arr, checked, 'checkedAll');
	},

	removeTests(){
		var tests = _eventEdit.testing.allTests;
		_eventEdit.testing.allTests = filter(tests, (item) => {
			return item.checked === false;
		});
	},

	sortAllTests(payload){
		var data = JSON.parse(payload);
		var isAsc = data.isAsc === 'true';
		sortTable(_eventEdit.testing.allTests, data.key, isAsc);
	},

	sortTestingList(payload){
		var data = JSON.parse(payload);
		var isAsc = data.isAsc === 'true';
		sortTable(_eventEdit.testing.testingList, data.key, isAsc);
	}
}

const courses = {
	sortTable(key, isAsc){
		sortTable(_eventEdit.courses.courses, key, isAsc);
	}
}

const files = {
	toggleFileIsAllowDownload(id, isAllowDownload){
		var _files = _eventEdit.files.files;
		var item = find(_files, (item) => {
			return item.id === id;
		});
		if (item){
			item.isAllowDownload = isAllowDownload;
		}
	},
	toggleCheckedAllFiles(checked){
		var container = _eventEdit.files;
		var arr = _eventEdit.files.files;
		toggleCheckedAll(container, arr, checked, 'checkedAllFiles');
	},
	toggleCheckedAllLibraryMaterials(checked){
		var container = _eventEdit.files;
		var arr = _eventEdit.files.libraryMaterials;
		toggleCheckedAll(container, arr, checked, 'checkedAllLibraryMaterials');
	},
	toggleFileChecked(id, checked){
		var container = _eventEdit.files;
		var arr = _eventEdit.files.files;
		toggleChecked(container, arr, id, checked, 'checkedAllFiles');
	},
	toggleLibraryMaterialChecked(id, checked){
		var container = _eventEdit.files;
		var arr = _eventEdit.files.libraryMaterials;
		toggleChecked(container, arr, id, checked, 'checkedAllLibraryMaterials');
	},
	uploadedFiles(_files){
		var files = _files.map((f) => {
			return new File(f);
		});
		_eventEdit.files.files = files;
		_eventEdit.files.isUploadingFiles = false;
		_eventEdit.files.checkedAllFiles = false;
	},
	uploadedLibraryMaterials(_files){
		var files = _files.map((f) => {
			return new LibraryMaterial(f);
		});
		_eventEdit.files.libraryMaterials = files;
		_eventEdit.files.isUploadingLibraryMaterials = false;
		_eventEdit.files.checkedAllLibraryMaterials = false;
	},
	removeFiles(inputFiles){
		var files = _eventEdit.files.files;
		_eventEdit.files.files = differenceWith(files, inputFiles, (first, second) => {
			return first.id === second.id;
		});
	},
	updateFiles(files){
		_eventEdit.files.files = files.map((item) => {
			var file = expand(item, (value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
			return new File(file);
		});
		_eventEdit.files.checkedAllFiles = false;
	},
	uploadingFiles(){
		_eventEdit.files.isUploadingFiles = true;
	},
	uploadingLibraryMaterials(){
		_eventEdit.files.isUploadingLibraryMaterials = true;
	},
	updateLibraryMaterials(libraryMaterials){
		_eventEdit.files.libraryMaterials = libraryMaterials.map((item) => {
			var libraryMaterial = expand(item, (value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
			return new LibraryMaterial(libraryMaterial);
		});
		_eventEdit.files.checkedAllLibraryMaterials = false;
	},
	changeInfoMessageLibraryMaterials(message, status){
		_eventEdit.files.infoMessageDownloadLibraryMaterials = message;
		_eventEdit.files.infoStatusDownloadLibraryMaterials = status;
	}
}

const EventEditStore = extend({}, EventEmitter.prototype, {
	
	getData(){
		return {..._eventEdit};
	},

	getPartialData(key) {
		return {..._eventEdit[key]}
	},

	isRequiredFieldsFilled(){
		var base = _eventEdit.base;
		var tutors = _eventEdit.tutors;
		return  base.name && 
				base.selectedCode && 
				base.selectedEducationMethod && 
				base.selectedEducationOrgId && 
				base.selectedType && 
				base.places.selectedNode &&
				tutors.tutors.length > 0 &&
				tutors.lectors.length > 0;
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
	var action = payload.action;
	var isEmit = false;

	switch(action.actionType) {

		case EventEditConstants.RECEIVE_EVENTEDIT_DATA:
			loadData(action.data);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_INFO_MESSAGE:
			changeInfoMessage(action.message, action.status);
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
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_OPEN:
			requests.changeIsOpen(action.checked);
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
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_BOSS:
			requests.changeIsApproveByBoss(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_TUTOR:
			requests.changeIsApproveByTutor(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_SORT_TABLE:
			requests.sortTable(action.payload);
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
			collaborators.sortTable(action.payload);
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
		case EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_CONDITIONS:
			collaborators.toggleCheckedConditions(action.payload);
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
			tutors.sortTutorsTable(action.payload);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_SORT_LECTORS_TABLE:
			tutors.sortLectorsTable(action.payload);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_TUTORS_CONDITIONS:
			tutors.toggleCheckedTutorsConditions(action.payload);
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
		case EventEditConstants.EVENTEDIT_TUTORS_UPDATE_INNER_LECTORS:
			tutors.updateInnerLectors(action.lectors);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_CREATE_LECTOR:
			tutors.createLector(action.lector);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TUTORS_SELECT_LECTOR_TYPE:
			tutors.selectLectorType(action.payload);
			isEmit = true;
			break;
			
		//testing
		case EventEditConstants.EVENTEDIT_TESTING_SELECT_TEST_TYPES:
			testing.selectTestTypes(action.payload);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_UPDATE_TESTS:
			testing.updateTests(action.tests, action.type);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_TOGGLE_CHECKED:
			testing.toggleChecked(action.id, action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_TOGGLE_CHECKED_ALL:
			testing.toggleCheckedAll(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_REMOVE_TESTS:
			testing.removeTests();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_SORT_ALL_TESTS:
			testing.sortAllTests(action.key, action.isAsc);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_TESTING_SORT_TESTING_LIST:
			testing.sortTestingList(action.key, action.isAsc);
			isEmit = true;
			break;

		//COURSES
		case EventEditConstants.EVENTEDIT_COURSES_SORT_TABLE:
			courses.sortTable(action.key, action.isAsc);
			isEmit = true;
			break;

		//FILES
		case EventEditConstants.EVENTEDIT_FILES_TOGGLE_FILE_IS_ALLOW_DOWNLOAD:
			files.toggleFileIsAllowDownload(action.id, action.isAllowDownload);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_ALL_FILES:
			files.toggleCheckedAllFiles(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_ALL_LIBRARY_MATERIALS:
			files.toggleCheckedAllLibraryMaterials(action.checked);
			isEmit = true;
			break;

		case EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_FILE:
			files.toggleFileChecked(action.id, action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_LIBRARY_MATERIAL:
			files.toggleLibraryMaterialChecked(action.id, action.checked);
			isEmit = true;
			break;

		case EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILES:
			files.uploadingFiles();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_UPLOADED_FILES:
			files.uploadedFiles(action.files);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_REMOVE_FILES:
			files.removeFiles(action.files);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_UPDATE_FILES:
			files.updateFiles(action.files);
			isEmit = true;
			break;	
		case EventEditConstants.EVENTEDIT_FILES_UPLOADING_LIBRARY_MATERIALS:
			files.uploadingLibraryMaterials();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_UPLOADED_LIBRARY_MATERIALS:
			files.uploadedLibraryMaterials(action.libraryMaterials);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_UPDATE_LIBRARY_MATERIALS:
			files.updateLibraryMaterials(action.libraryMaterials);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_FILES_CHANGE_INFO_MESSAGE_LIBRARY_MATERIALS:
			files.changeInfoMessageLibraryMaterials(action.message, action.status);
			isEmit = true;
			break;	

		default:
			return true;
	}

	if (isEmit) EventEditStore.emitChange();
	return true;
});
export default EventEditStore;
