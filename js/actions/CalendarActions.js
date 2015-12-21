var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarConstants = require('../constants/CalendarConstants');
var CalendarAPI = require('../api/CalendarAPI');

var CalendarActions = {
	
	receiveData: function(data) {
		AppDispatcher.handleAction({
			actionType: CalendarConstants.RECEIVE_CALENDAR_DATA,
			data: data
		});
	},

	changeYear: function(year, monthIndex){
		CalendarAPI.getEvents(year, monthIndex).then(function(events){
			AppDispatcher.handleAction({
				actionType: CalendarConstants.CHANGE_CALENDAR_YEAR,
				year: year,
				events: events
			});
		});
	},

	changeMonth: function(monthIndex, year) {
		CalendarAPI.getEvents(year, monthIndex).then(function(events){
			AppDispatcher.handleAction({
				actionType: CalendarConstants.CHANGE_CALENDAR_MONTH,
				monthIndex: monthIndex,
				events: events
			});
		});
	},

	changeStatus: function(status) {
		AppDispatcher.handleAction({
			actionType: CalendarConstants.CHANGE_CALENDAR_STATUS,
			status: status
		});
	},

	changeSearchText: function(text) {
		AppDispatcher.handleAction({
			actionType: CalendarConstants.CHANGE_CALENDAR_SEARCH_TEXT,
			text: text
		});
	},

	selectDate: function(date) {
		AppDispatcher.handleAction({
			actionType: CalendarConstants.SELECT_CALENDAR_DATE,
			date: date
		});
	},
}

module.exports = CalendarActions;