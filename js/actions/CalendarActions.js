var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarConstants = require('../constants/CalendarConstants');

var CalendarActions = {

	receiveData: function(data) {
		AppDispatcher.handleAction({
			actionType: CalendarConstants.RECEIVE_CALENDAR_DATA,
			data: data
		});
	},

	changeMonth: function(index) {
		AppDispatcher.handleAction({
			actionType: CalendarConstants.CHANGE_CALENDAR_MONTH,
			index: index
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