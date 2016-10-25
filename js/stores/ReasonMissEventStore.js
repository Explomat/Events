var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ReasonMissEventConstants = require('../constants/ReasonMissEventConstants');
var ReasonMissEvent = require('../models/reasonMissEvent/ReasonMissEvent');
var assign = require('lodash/assign');
var orderBy = require('lodash/orderBy');
var extend = require('extend');

var _reasonMissEvent = {};

function loadData(data) {
	_reasonMissEvent = new ReasonMissEvent(data);
}

function setFailure(error, errorKey, fetchingKey){
	let newState = assign({}, _reasonMissEvent, {[errorKey]: error});
	delete newState[fetchingKey];
	_reasonMissEvent = newState;
}

function searchData(value){
	let users = _reasonMissEvent.users;

	value = value.toLowerCase();
	let filteredUsers = users.filter(item => {
		const name = item.userName.toLowerCase();
		const event = item.eventName.toLowerCase();
		return (~name.indexOf(value) || ~event.indexOf(value))
	});
	_reasonMissEvent = assign({}, _reasonMissEvent, { filteredUsers: filteredUsers });
}

function sortData(payload){
	let filteredUsers = _reasonMissEvent.filteredUsers;

	function sortTable(array, key, isAsc){
		const ascending = isAsc === 'true' ? 'asc' : 'desc';
		return orderBy(array, [key], [ascending]);
	}

	var data = JSON.parse(payload);
	var newData = sortTable(filteredUsers, data.key, data.isAsc);
	_reasonMissEvent = assign({}, _reasonMissEvent, {filteredUsers: newData});
}

function removeUser(newState, eventResultID){
	let _filteredUsers = _reasonMissEvent.filteredUsers;

	let filteredUsers = _filteredUsers.filter(item => {
		return item.eventResultID != eventResultID;
	});
	_reasonMissEvent = assign({}, _reasonMissEvent, newState, { filteredUsers: filteredUsers });
}


var ReasonMissEventStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return {..._reasonMissEvent};
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

ReasonMissEventStore.dispatchToken = AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {

		case ReasonMissEventConstants.REASON_MISS_EVENT_RECEIVE_DATA:
			loadData(action.data);
			break;
		case ReasonMissEventConstants.REASON_MISS_EVENT_SEARCH_DATA:
			searchData(action.value);
			break;
		case ReasonMissEventConstants.REASON_MISS_EVENT_SORT_DATA:
			sortData(action.payload);
			break;
		case ReasonMissEventConstants.REASON_MISS_EVENT_REMOVE_USER:
			_reasonMissEvent = assign({}, _reasonMissEvent, { fetchingRemoveUser: true });
			break;
		case ReasonMissEventConstants.REASON_MISS_EVENT_REMOVE_USER_SUCCESS:
			removeUser(action.response, action.event_result_id);
			break;
		case ReasonMissEventConstants.REASON_MISS_EVENT_REMOVE_USER_FAILURE:
			setFailure(action.error, "errorRemoveUser", "fetchingRemoveUser");
			break;
		default:
			return true;
	}

	ReasonMissEventStore.emitChange();
	return true;
});

module.exports = ReasonMissEventStore;
