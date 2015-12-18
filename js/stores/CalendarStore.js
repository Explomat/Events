var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CalendarConstants = require('../constants/CalendarConstants');
var CalendarEventStatuses = require('../utils/event/CalendarEventStatuses');
var extend = require('extend');

var _calendar = {};

function loadData(data) {
	_calendar = data;
}

function changeMonth(index){
	_calendar.selectedMonthIndex = index;
}

function selectDate(date){
	_calendar.selectedDate = date;
}

function changeYear(year){
	_calendar.selectedYear = year;
}

function changeStatus(status){
	_calendar.selectedStatus = status;
	_calendar.filterEvents = _calendar.events.filter(function(ev){
		return ev.status === status || status === CalendarEventStatuses.keys.all;
	});
}

function changeSearchText(text){
	_calendar.searchText = text;
	_calendar.filterEvents = _calendar.events.filter(function(ev){
		return ev.name.indexOf(text) !== -1;
	});
}

var CalendarStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return _calendar;
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

CalendarStore.dispatchToken = AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {

		case CalendarConstants.RECEIVE_CALENDAR_DATA:
			loadData(action.data);
			break;
		case CalendarConstants.CHANGE_CALENDAR_YEAR:
			changeYear(action.year);
			break;
		case CalendarConstants.CHANGE_CALENDAR_MONTH:
			changeMonth(action.index);
			break;
		case CalendarConstants.CHANGE_CALENDAR_STATUS:
			changeStatus(action.status);
			break;
		case CalendarConstants.CHANGE_CALENDAR_SEARCH_TEXT:
			changeSearchText(action.text);
			break;
		case CalendarConstants.SELECT_CALENDAR_DATE:
			selectDate(action.date);
			break;
		default:
			return true;
	}

	CalendarStore.emitChange();
	return true;
});

module.exports = CalendarStore;
