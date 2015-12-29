var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventInfoConstants = require('../constants/EventInfoConstants');
var EventInfoAPI = require('../api/EventInfoAPI');

var EventInfoActions = {
	
	receiveData: function(data) {
		AppDispatcher.handleAction({
			actionType: EventInfoConstants.RECEIVE_EVENTINFO_DATA,
			data: data
		});
	},

	disposeData: function(){
		AppDispatcher.handleAction({
			actionType: EventInfoConstants.DISPOSE_EVENTINFO_DATA
		});
	},

	createRequest: function(eventId){
		EventInfoAPI.createRequest(eventId).then(function(err){
			if (!err) {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
					text: 'Вы успешно подали заявку'
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CHANGE_ERROR_EVENTINFO,
					text: err
				});
			}
		},function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_ERROR_EVENTINFO,
				text: err
			});
		});
	},

	removeCollaborator: function(eventId, userId){
		EventInfoAPI.removeCollaborator(eventId).then(function(err){
			if (!err) {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.REMOVE_COLLABORATOR_EVENTINFO,
					userId: userId
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CHANGE_ERROR_EVENTINFO,
					text: err
				});
			}
		},function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_ERROR_EVENTINFO,
				text: err
			});
		});
	},

	clearError: function(){
		AppDispatcher.handleAction({
			actionType: EventInfoConstants.CHANGE_ERROR_EVENTINFO,
			text: null
		});
	},

	clearInfo: function(){
		AppDispatcher.handleAction({
			actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
			text: null
		});
	}
}

module.exports = EventInfoActions;