var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EventInfoConstants = require('../constants/EventInfoConstants');
var EventInfo = require('../models/EventInfo');
var extend = require('extend');

var _eventInfo = {};

function loadData(data) {
	_eventInfo = new EventInfo(data);
}

var EventInfoStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return _eventInfo;
	},

	isUserInEvent: function(){
		return _eventInfo.collaborators.find(function(col){
			_eventInfo.userId == col.id;
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

	switch(action.actionType) {

		case EventInfoConstants.RECEIVE_EVENTINFO_DATA:
			loadData(action.data);
			break;
		default:
			return true;
	}

	EventInfoStore.emitChange();
	return true;
});

module.exports = EventInfoStore;
