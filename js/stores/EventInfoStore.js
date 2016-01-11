var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EventInfoConstants = require('../constants/EventInfoConstants');
var EventInfo = require('../models/EventInfo');
var extend = require('extend');

var _eventInfo = {}, _info = null;

function loadData(data) {
	_eventInfo = new EventInfo(data);
}

function disposeData(){
	_eventInfo = null;
	_error = null;
	_info = null;
}

function removeCollaborator(userId){
	var userIndex = _eventInfo.collaborators.findIndex(function(c){
		return c.id == userId;
	});
	if (userIndex !== undefined) {
		_eventInfo.collaborators.splice(userIndex, 1);
		changeInfo("Вы были успешно удалены из участников");
	}
}

function changeInfo(text){
	_info = text;
}

var EventInfoStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return _eventInfo;
	},
	
	getInfo: function(){
		return _info;
	},

	isUserInEvent: function(userId){
		return _eventInfo.collaborators.find(function(col){
			return userId == col.id;
		});
	},

	getWebinarInfo: function(){
		return _eventInfo.webinarInfo;
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

EventInfoStore.dispatchToken = AppDispatcher.register(function(payload) {
	var action = payload.action;
	var isEmit = false;

	switch(action.actionType) {

		case EventInfoConstants.RECEIVE_EVENTINFO_DATA:
			loadData(action.data);
			isEmit = true;
			break;
		case EventInfoConstants.DISPOSE_EVENTINFO_DATA:
			disposeData();
			break;
		case EventInfoConstants.REMOVE_COLLABORATOR_EVENTINFO:
			removeCollaborator(action.userId);
			isEmit = true;
			break;
		case EventInfoConstants.CHANGE_INFO_EVENTINFO:
			changeInfo(action.text);
			isEmit = true;
			break;
		default:
			return true;
	}

	if (isEmit) EventInfoStore.emitChange();
	return true;
});

module.exports = EventInfoStore;
