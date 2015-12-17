var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarConstants = require('../constants/CalendarConstants');

var CalendarActions = {

	receiveData: function(data) {
		AppDispatcher.handleAction({
			actionType: CalendarConstants.RECEIVE_CALENDAR_DATA,
			data: data
		});
	}

}

module.exports = CalendarActions;