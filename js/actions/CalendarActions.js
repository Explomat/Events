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

	changeYear: function(year, monthIndex, businessType, region){
		CalendarAPI.getEvents(year, monthIndex, businessType, region).then(function(events){
			AppDispatcher.handleAction({
				actionType: CalendarConstants.CHANGE_CALENDAR_YEAR,
				year: year,
				events: events
			});
		});
	},

	changeMonth: function(monthIndex, year, businessType, region) {
		CalendarAPI.getEvents(year, monthIndex, businessType, region).then(function(events){
			AppDispatcher.handleAction({
				actionType: CalendarConstants.CHANGE_CALENDAR_MONTH,
				monthIndex: monthIndex,
				events: events
			});
		});
	},

	changeBusinessType: function(monthIndex, year, businessType, region){
		CalendarAPI.getEvents(year, monthIndex, businessType, region).then(function(events){
			AppDispatcher.handleAction({
				actionType: CalendarConstants.CHANGE_CALENDAR_BUSINESSTYPE,
				businessType: businessType,
				events: events
			});
		});
	},

	changeRegion: function(monthIndex, year, businessType, region){
		CalendarAPI.getEvents(year, monthIndex, businessType, region).then(function(events){
			AppDispatcher.handleAction({
				actionType: CalendarConstants.CHANGE_CALENDAR_REGION,
				region: region,
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

	loading: function(isLoading){
		AppDispatcher.handleAction({
			actionType: CalendarConstants.LOADING_CALENDAR_DATA,
			isLoading: isLoading
		});
	}
}

module.exports = CalendarActions;