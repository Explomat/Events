var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EventNewConstants = require('../constants/EventNewConstants');
var EventNew = require('../models/eventnew/EventNew');
var Lector = require('../models/eventnew/Lector');
var extend = require('extend');
var every = require('lodash/every');
var EventTypes = require('../utils/eventedit/EventTypes').default;

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
		if (type === EventTypes.keys.one_time) {
			_eventNew.base.educationMethodId = null;
			_eventNew.base.educationMethodValue = null;
		}
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

var lectors = {
	selectLectorType(lectorType){
		_eventNew.lectors.lectorSelectedType = lectorType;
	},
	selectAddLectorType(lectorType){
		_eventNew.lectors.lectorAddSelectedType = lectorType;
	},
	selectSearchLectorType(lectorType){
		_eventNew.lectors.lectorSearchType = lectorType;
	},

	selectInnerListLector(id, value){
		_eventNew.lectors.innerListLectorId = id;
		_eventNew.lectors.innerListLectorFullname = value;

		_eventNew.lectors.innerNewLectorId = null;
		_eventNew.lectors.innerNewLectorFullname = null;
		_eventNew.lectors.outerListLectorId = null;
		_eventNew.lectors.outerListLectorFullname = null;
		_eventNew.lectors.lector = new Lector();
	},
	selectInnerNewLector(id, value){
		_eventNew.lectors.innerNewLectorId = id;
		_eventNew.lectors.innerNewLectorFullname = value;

		_eventNew.lectors.innerListLectorId = null;
		_eventNew.lectors.innerListLectorFullname = null;
		_eventNew.lectors.outerListLectorId = null;
		_eventNew.lectors.outerListLectorFullname = null;
		_eventNew.lectors.lector = new Lector();
	},
	selectOuterListLector(id, value){
		_eventNew.lectors.outerListLectorId = id;
		_eventNew.lectors.outerListLectorFullname = value;

		_eventNew.lectors.innerListLectorId = null;
		_eventNew.lectors.innerListLectorFullname = null;
		_eventNew.lectors.innerNewLectorId = null;
		_eventNew.lectors.innerNewLectorFullname = null;
		_eventNew.lectors.lector = new Lector();
	},

	changeLectorFirstName(firstName){
		_eventNew.lectors.lector.firstName = firstName;

		_eventNew.lectors.innerListLectorId = null;
		_eventNew.lectors.innerListLectorFullname = null;
		_eventNew.lectors.innerNewLectorId = null;
		_eventNew.lectors.innerNewLectorFullname = null;
		_eventNew.lectors.outerListLectorId = null;
		_eventNew.lectors.outerListLectorFullname = null;
	},
	changeLectorLastName(lastName){
		_eventNew.lectors.lector.lastName = lastName;

		_eventNew.lectors.innerListLectorId = null;
		_eventNew.lectors.innerListLectorFullname = null;
		_eventNew.lectors.innerNewLectorId = null;
		_eventNew.lectors.innerNewLectorFullname = null;
		_eventNew.lectors.outerListLectorId = null;
		_eventNew.lectors.outerListLectorFullname = null;
	},
	changeLectorMiddleName(middleName){
		_eventNew.lectors.lector.middleName = middleName;

		_eventNew.lectors.innerListLectorId = null;
		_eventNew.lectors.innerListLectorFullname = null;
		_eventNew.lectors.innerNewLectorId = null;
		_eventNew.lectors.innerNewLectorFullname = null;
		_eventNew.lectors.outerListLectorId = null;
		_eventNew.lectors.outerListLectorFullname = null;
	},
	changeLectorEmail(email){
		_eventNew.lectors.lector.email = email;

		_eventNew.lectors.innerListLectorId = null;
		_eventNew.lectors.innerListLectorFullname = null;
		_eventNew.lectors.innerNewLectorId = null;
		_eventNew.lectors.innerNewLectorFullname = null;
		_eventNew.lectors.outerListLectorId = null;
		_eventNew.lectors.outerListLectorFullname = null;
	},
	changeLectorCompany(company){
		_eventNew.lectors.lector.company = company;

		_eventNew.lectors.innerListLectorId = null;
		_eventNew.lectors.innerListLectorFullname = null;
		_eventNew.lectors.innerNewLectorId = null;
		_eventNew.lectors.innerNewLectorFullname = null;
		_eventNew.lectors.outerListLectorId = null;
		_eventNew.lectors.outerListLectorFullname = null;
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
		if (key === 'placeAndDateTime') {
			return every(Object.keys(partialData), (i) => {
				return Boolean(partialData[i]);
			});
		}
		else if (key === 'base') {
			return every(Object.keys(partialData), (i) => {
				if ((i === 'educationMethodId' || i === 'educationMethodValue') && partialData['type'] === EventTypes.keys.one_time) {
					return true;
				}
				return Boolean(partialData[i]);
			});
		}
		else if (key === 'lectors'){
			let {innerListLectorId, innerNewLectorId, outerListLectorId, lector} = partialData;
			return Boolean(innerListLectorId || 
							innerNewLectorId || 
							outerListLectorId || 
							((lector.firstName && lector.firstName.trim()) && (lector.lastName && lector.lastName.trim()) && (lector.email && lector.email.trim()) && (lector.company && lector.company.trim())));
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
			lectors.selectLectorType(action.lectorType);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_ADD_LECTOR_TYPE:
			lectors.selectAddLectorType(action.lectorType);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_SEARCH_LECTOR_TYPE:
			lectors.selectSearchLectorType(action.lectorType);
			break;

		case EventNewConstants.EVENT_NEW_SELECT_INNER_LIST_LECTOR:
			lectors.selectInnerListLector(action.id, action.value);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_INNER_NEW_LECTOR:
			lectors.selectInnerNewLector(action.id, action.value);
			break;
		case EventNewConstants.EVENT_NEW_SELECT_OUTER_LIST_LECTOR:
			lectors.selectOuterListLector(action.id, action.value);
			break;

		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_FIRST_NAME:
			lectors.changeLectorFirstName(action.firstName);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_LAST_NAME:
			lectors.changeLectorLastName(action.lastName);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_MIDDLE_NAME:
			lectors.changeLectorMiddleName(action.middleName);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_EMAIL:
			lectors.changeLectorEmail(action.email);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_LECTOR_COMPANY:
			lectors.changeLectorCompany(action.company);
			break;

		default:
			return true;
	}

	EventNewStore.emitChange();
	return true;
});

module.exports = EventNewStore;
