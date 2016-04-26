var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EventNewConstants = require('../constants/EventNewConstants');
var EventNew = require('../models/EventNew');
var extend = require('extend');

var _eventNew = {};

function setDefaultData() {
	_eventNew = new EventNew();
}

function setCollaborators(collaborators){
	_eventNew.collaborators = collaborators;
}

var EventNewStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return _eventNew;
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

		case EventNewConstants.EVENT_NEW_SET_DEFAULT_DATA:
			setDefaultData();
			break;
		case EventNewConstants.EVENT_NEW_GET_COLLABORATORS:
			setCollaborators(action.collaborators);
			break;
		default:
			return true;
	}

	EventNewStore.emitChange();
	return true;
});

module.exports = EventNewStore;
