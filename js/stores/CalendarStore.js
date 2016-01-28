var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
//var CalendarAPI = require('../api/CalendarAPI');
var CalendarConstants = require('../constants/CalendarConstants');
var EventInfoConstants = require('../constants/EventInfoConstants');
var CalendarEventStatuses = require('../utils/event/CalendarEventStatuses');
var EventStatuses = require('../utils/event/EventStatuses')
var Calendar = require('../models/Calendar');
var ShortEvent = require('../models/ShortEvent');
var extend = require('extend');

var _calendar = {};

function _filterEvents(_events){
	return _events.filter(function(ev){
		var eventName = ev.name.toLowerCase();
		var searchText = _calendar.searchText.toLowerCase();
		return eventName.indexOf(searchText) !== -1 && 
			(ev.status === _calendar.selectedStatus || _calendar.selectedStatus === CalendarEventStatuses.keys.all);
	});
}

function prepareEvents(events) {
	return events.map(function(ev){
		return new ShortEvent(ev);
	});
}

function loadData(data) {
	_calendar = new Calendar(data);
	_calendar.filterEvents = _filterEvents(_calendar.events);
}

function changeMonth(monthIndex, events){
	_calendar.selectedMonthIndex = monthIndex;
	_calendar.events = prepareEvents(events);
	_calendar.filterEvents = _filterEvents(_calendar.events);
}

function changeYear(year, events){
	_calendar.selectedYear = year;
	_calendar.events = prepareEvents(events);
	_calendar.filterEvents = _filterEvents(_calendar.events);
}

function changeBusinessType(businessType, events){
	_calendar.selectedBusinessType = businessType;
	_calendar.events = prepareEvents(events);
	_calendar.filterEvents = _filterEvents(_calendar.events);
}

function changeRegion(region, events){
	_calendar.selectedRegion = region;
	_calendar.events = prepareEvents(events);
	_calendar.filterEvents = _filterEvents(_calendar.events);
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

function startEvent(eventId) {
	var shortEvent = _calendar.events.find(function(e){
		return e.id === eventId;
	});
	if (shortEvent) shortEvent.status = EventStatuses.keys.active;
}

function finishEvent(eventId) {
	var shortEvent = _calendar.events.find(function(e){
		return e.id === eventId;
	});
	if (shortEvent) shortEvent.status = EventStatuses.keys.close;
}

var CalendarStore = extend({}, EventEmitter.prototype, {
	
	getData: function(){
		return _calendar;
	},

	getUserId: function(){
		return _calendar.user.id;
	},

	getUserComponentsDenied: function(){
		return _calendar.user.componentsDenied;
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
		case CalendarConstants.CHANGE_CALENDAR_BUSINESSTYPE:
			changeBusinessType(action.businessType, action.events);
			break;
		case CalendarConstants.CHANGE_CALENDAR_REGION:
			changeRegion(action.region, action.events);
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

		//listen constants from other store
		case EventInfoConstants.START_EVENT_EVENTINFO:
			startEvent(action.eventId);
			break;
		case EventInfoConstants.FINISH_EVENT_EVENTINFO:
			finishEvent(action.eventId);
			break;
		//---------------------------------------
		default:
			return true;
	}

	CalendarStore.emitChange();
	//CalendarAPI.saveToStorage(_calendar);
	return true;
});

module.exports = CalendarStore;
