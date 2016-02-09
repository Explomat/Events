var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EventEditConstants = require('../constants/EventEditConstants');
var EventEdit = require('../models/EventEdit');
var extend = require('extend');

var _eventEdit = {};

function loadData(data) {
	_eventEdit = new EventEdit(data);
}

var EventEditStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return _eventEdit;
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

EventEditStore.dispatchToken = AppDispatcher.register(function(payload) {
	var action = payload.action;
	var isEmit = false;

	switch(action.actionType) {

		case EventEditConstants.RECEIVE_EVENTEDIT_DATA:
			loadData(action.data);
			isEmit = true;
			break;
		default:
			return true;
	}

	if (isEmit) EventEditStore.emitChange();
	return true;
});

module.exports = EventEditStore;
