var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventInfoConstants = require('../constants/EventInfoConstants');
var EventInfoAPI = require('../api/EventInfoAPI');

var EventInfoActions = {
	
	receiveData: function(data) {
		AppDispatcher.handleAction({
			actionType: EventInfoConstants.RECEIVE_EVENTINFO_DATA,
			data: data
		});
	}
}

module.exports = EventInfoActions;