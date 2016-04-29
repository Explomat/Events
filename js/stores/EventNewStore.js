var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EventNewConstants = require('../constants/EventNewConstants');
var EventNew = require('../models/EventNew');
var extend = require('extend');

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

var dateTime = {

	changeStartDateTime(dateTime){
		var finishDateTime = _eventNew.dateTime.finishDateTime;
		var startDateTime = new Date(dateTime);
		_eventNew.dateTime.startDateTime = startDateTime;

		if (startDateTime > finishDateTime) {
			_eventNew.dateTime.finishDateTime = startDateTime;
		}
	},
	changeFinishDateTime(dateTime){
		var startDateTime = _eventNew.dateTime.startDateTime;
		var finishDateTime = new Date(dateTime);
		_eventNew.dateTime.finishDateTime = finishDateTime;

		if (finishDateTime < startDateTime) {
			_eventNew.dateTime.startDateTime = finishDateTime;
		}
	}
}

var place = {
	selectPlace(id, value){
		_eventNew.place.placeId = id;
		_eventNew.place.placeValue = value;
	}
}

var EventNewStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return {..._eventNew};
	},

	getPartialData: function(key){
		return {..._eventNew[key]};
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

		//DATETIME
		case EventNewConstants.EVENT_NEW_CHANGE_START_DATE_TIME:
			dateTime.changeStartDateTime(action.dateTime);
			break;
		case EventNewConstants.EVENT_NEW_CHANGE_START_FINISH_TIME:
			dateTime.changeFinishDateTime(action.dateTime);
			break;

		//PLACE
		case EventNewConstants.EVENT_NEW_SELECT_PLACE:
			place.selectPlace(action.id, action.value);
			break;
		default:
			return true;
	}

	EventNewStore.emitChange();
	return true;
});

module.exports = EventNewStore;
