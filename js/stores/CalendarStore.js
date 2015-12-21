var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CalendarConstants = require('../constants/CalendarConstants');
var CalendarEventStatuses = require('../utils/event/CalendarEventStatuses');
var extend = require('extend');

var _calendar = {};

function _filterEvents(_events){
	return _events.filter(function(ev){
		return ev.name.indexOf(_calendar.searchText) !== -1 && 
			(ev.status === _calendar.selectedStatus || _calendar.selectedStatus === CalendarEventStatuses.keys.all);
	});
}

function loadData(data) {
	_calendar = data;
}

function changeMonth(monthIndex, events){
	_calendar.selectedMonthIndex = monthIndex;
	_calendar.events = events;
	_calendar.filterEvents = _filterEvents(events);
}

function changeYear(year, events){
	_calendar.selectedYear = year;
	_calendar.events = events;
	_calendar.filterEvents = _filterEvents(events);
}

function selectDate(date){
	_calendar.selectedDate = date;
}

function changeStatus(status){
	_calendar.selectedStatus = status;
	_calendar.filterEvents = _filterEvents(_calendar.events);
}

function changeSearchText(text){
	_calendar.searchText = text;
	_calendar.filterEvents = _filterEvents(_calendar.events);
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
		case CalendarConstants.CHANGE_CALENDAR_MONTH:
			changeMonth(action.monthIndex, action.events);
			break;
		case CalendarConstants.CHANGE_CALENDAR_YEAR:
			changeYear(action.year, action.events);
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
