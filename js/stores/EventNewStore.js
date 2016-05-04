var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EventNewConstants = require('../constants/EventNewConstants');
var EventNew = require('../models/EventNew');
var Lector = require('../models/eventedit/Lector');
var extend = require('extend');
var every = require('lodash/every');

var _eventNew = {};

function receiveData(data) {
	_eventNew = new EventNew(data);
}

var base = {
	changeName(name){
		_eventNew.base.name = name;
	},
	changeType(type){
		_eventNew.base.type = type;
	},
	changeCode(code){
		_eventNew.base.code = code;
	},
	changeEducationOrg(orgId){
		_eventNew.base.educationOrgId = orgId;
	},
	selectEducationMethod(id, value){
		_eventNew.base.educationMethodId = id;
		_eventNew.base.educationMethodValue = value;
	},
	selectTutor(id, value){
		_eventNew.base.tutorId = id;
		_eventNew.base.tutorValue = value;
	},
	changeMaxPersonNum(num){
		_eventNew.base.maxPersonNum = num;
	}
}

var placeAndDateTime = {

	changeStartDateTime(dateTime){
		var finishDateTime = _eventNew.placeAndDateTime.finishDateTime;
		var startDateTime = new Date(dateTime);
		_eventNew.placeAndDateTime.startDateTime = startDateTime;

		if (startDateTime > finishDateTime) {
			_eventNew.placeAndDateTime.finishDateTime = startDateTime;
		}
	},
	changeFinishDateTime(dateTime){
		var startDateTime = _eventNew.placeAndDateTime.startDateTime;
		var finishDateTime = new Date(dateTime);
		_eventNew.placeAndDateTime.finishDateTime = finishDateTime;

		if (finishDateTime < startDateTime) {
			_eventNew.placeAndDateTime.startDateTime = finishDateTime;
		}
	},
	selectPlace(id, value){
		_eventNew.placeAndDateTime.placeId = id;
		_eventNew.placeAndDateTime.placeValue = value;
	}
}

var tutors = {
	selectLectorType(lectorType){
		_eventNew.tutors.lectorSelectedType = lectorType;
	},
	selectAddLectorType(lectorType){
		_eventNew.tutors.lectorAddSelectedType = lectorType;
	},
	selectSearchLectorType(lectorType){
		_eventNew.tutors.lectorSearchType = lectorType;
	},

	selectInnerListLector(id, value){
		_eventNew.tutors.innerListLectorId = id;
		_eventNew.tutors.innerListLectorFullname = value;

		_eventNew.tutors.innerNewLectorId = null;
		_eventNew.tutors.innerNewLectorFullname = null;
		_eventNew.tutors.outerListLectorId = null;
		_eventNew.tutors.outerListLectorFullname = null;
		_eventNew.tutors.lector = new Lector();
	},
	selectInnerNewLector(id, value){
		_eventNew.tutors.innerNewLectorId = id;
		_eventNew.tutors.innerNewLectorFullname = value;

		_eventNew.tutors.innerListLectorId = null;
		_eventNew.tutors.innerListLectorFullname = null;
		_eventNew.tutors.outerListLectorId = null;
		_eventNew.tutors.outerListLectorFullname = null;
		_eventNew.tutors.lector = new Lector();
	},
	selectOuterListLector(id, value){
		_eventNew.tutors.outerListLectorId = id;
		_eventNew.tutors.outerListLectorFullname = value;

		_eventNew.tutors.innerListLectorId = null;
		_eventNew.tutors.innerListLectorFullname = null;
		_eventNew.tutors.innerNewLectorId = null;
		_eventNew.tutors.innerNewLectorFullname = null;
		_eventNew.tutors.lector = new Lector();
	},

	changeLectorFirstName(firstName){
		_eventNew.tutors.lector.firstName = firstName;

		_eventNew.tutors.innerListLectorId = null;
		_eventNew.tutors.innerListLectorFullname = null;
		_eventNew.tutors.innerNewLectorId = null;
		_eventNew.tutors.innerNewLectorFullname = null;
		_eventNew.tutors.outerListLectorId = null;
		_eventNew.tutors.outerListLectorFullname = null;
	},
	changeLectorLastName(lastName){
		_eventNew.tutors.lector.lastName = lastName;

		_eventNew.tutors.innerListLectorId = null;
		_eventNew.tutors.innerListLectorFullname = null;
		_eventNew.tutors.innerNewLectorId = null;
		_eventNew.tutors.innerNewLectorFullname = null;
		_eventNew.tutors.outerListLectorId = null;
		_eventNew.tutors.outerListLectorFullname = null;
	},
	changeLectorMiddleName(middleName){
		_eventNew.tutors.lector.middleName = middleName;

		_eventNew.tutors.innerListLectorId = null;
		_eventNew.tutors.innerListLectorFullname = null;
		_eventNew.tutors.innerNewLectorId = null;
		_eventNew.tutors.innerNewLectorFullname = null;
		_eventNew.tutors.outerListLectorId = null;
		_eventNew.tutors.outerListLectorFullname = null;
	},
	changeLectorEmail(email){
		_eventNew.tutors.lector.email = email;

		_eventNew.tutors.innerListLectorId = null;
		_eventNew.tutors.innerListLectorFullname = null;
		_eventNew.tutors.innerNewLectorId = null;
		_eventNew.tutors.innerNewLectorFullname = null;
		_eventNew.tutors.outerListLectorId = null;
		_eventNew.tutors.outerListLectorFullname = null;
	},
	changeLectorCompany(company){
		_eventNew.tutors.lector.company = company;

		_eventNew.tutors.innerListLectorId = null;
		_eventNew.tutors.innerListLectorFullname = null;
		_eventNew.tutors.innerNewLectorId = null;
		_eventNew.tutors.innerNewLectorFullname = null;
		_eventNew.tutors.outerListLectorId = null;
		_eventNew.tutors.outerListLectorFullname = null;
	}
}

var EventNewStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return {..._eventNew};
	},

	getPartialData: function(key){
		return {..._eventNew[key]};
	},

	isAllFieldsFilled(key){
		var partialData = {..._eventNew[key]};
		if (key === 'base' || 'placeAndDateTime') {
			return every(Object.keys(partialData), (i) => {
				return Boolean(partialData[i]);
			});
		}
		else if (key === 'tutors'){
			return (partialData.innerListLectorId || partialData.innerNewLectorId || partialData.outerListLectorId || partialData.lector.fullname);
		}
		return false;
	},

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callBack) {
		this.on('change', callBack);
	},

	removeChangeListener: function(callBack) {
		this.removeListener('change', callBack);
	}
});

EventNewStore.dispatchToken = AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {

		case EventNewConstants.EVENT_NEW_RECEIVE_DATA:
			receiveData(action.data);
			break;

		//BASE
		case EventNewConstants.EVENT_NEW_CHANGE_NAME:
			base.changeName(action.name);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_TYPE:
			base.changeType(action.type);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_CODE:
			base.changeCode(action.code);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_EDUCATION_ORG:
			base.changeEducationOrg(action.orgId);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_EDUCATION_METHOD:
			base.selectEducationMethod(action.id, action.value);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_TUTOR:
			base.selectTutor(action.id, action.value);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_MAX_PERSON_NUM:
			base.changeMaxPersonNum(action.num);
			break;

		//PLACE & DATETIME
		case EventNewConstants.EVENT_NEW_CHANGE_START_DATE_TIME:
			placeAndDateTime.changeStartDateTime(action.dateTime);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_START_FINISH_TIME:
			placeAndDateTime.changeFinishDateTime(action.dateTime);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_PLACE:
			placeAndDateTime.selectPlace(action.id, action.value);
			break;

		//TUTORS
		case EventNewConstants.EVENT_NEW_SELECT_LECTOR_TYPE:
			tutors.selectLectorType(action.lectorType);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_ADD_LECTOR_TYPE:
			tutors.selectAddLectorType(action.lectorType);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_SEARCH_LECTOR_TYPE:
			tutors.selectSearchLectorType(action.lectorType);
			break;

		case EventNewConstants.EVENT_NEW_SELECT_INNER_LIST_LECTOR:
			tutors.selectInnerListLector(action.id, action.value);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_INNER_NEW_LECTOR:
			tutors.selectInnerNewLector(action.id, action.value);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_OUTER_LIST_LECTOR:
			tutors.selectOuterListLector(action.id, action.value);
			break;

		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_FIRST_NAME:
			tutors.changeLectorFirstName(action.firstName);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_LAST_NAME:
			tutors.changeLectorLastName(action.lastName);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_MIDDLE_NAME:
			tutors.changeLectorMiddleName(action.middleName);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_EMAIL:
			tutors.changeLectorEmail(action.email);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_COMPANY:
			tutors.changeLectorCompany(action.company);
			break;

		default:
			return true;
	}

	EventNewStore.emitChange();
	return true;
});

module.exports = EventNewStore;
