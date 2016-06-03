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
					actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
					text: err
				});
			}
		}, function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
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
					actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
					text: err
				});
			}
		},function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
				text: err
			});
		});
	},

	startEvent: function(eventId){
		EventInfoAPI.startEvent(eventId).then(function(err){
			if (!err) {
				try {
					AppDispatcher.handleAction({
						actionType: EventInfoConstants.START_EVENT_EVENTINFO,
						eventId: eventId,
						text: 'Вы стартовали мероприятие.'
					});
				}catch(e) { console.log(e.stack); }
				
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
					text: err
				});
			}
		}, function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
				text: err
			});
		});
	},

	finishEvent: function(eventId){
		EventInfoAPI.finishEvent(eventId).then(function(err){
			if (!err) {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.FINISH_EVENT_EVENTINFO,
					eventId: eventId,
					text: 'Вы завершили мероприятие.'
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
					text: err
				});
			}
		}, function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
				text: err
			});
		});
	},

	planEvent: function(eventId){
		EventInfoAPI.planEvent(eventId).then(function(err){
			if (!err) {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.PLAN_EVENT_EVENTINFO,
					eventId: eventId,
					text: 'Вы перевели мероприятие в статус "Планируется"'
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
					text: err
				});
			}
		}, function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
				text: err
			});
		});
	},

	cancelEvent: function(eventId){
		EventInfoAPI.cancelEvent(eventId).then(function(err){
			if (!err) {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CANCEL_EVENT_EVENTINFO,
					eventId: eventId,
					text: 'Вы отменили мероприятие.'
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
					text: err
				});
			}
		}, function(err){
			AppDispatcher.handleAction({
				actionType: EventInfoConstants.CHANGE_INFO_EVENTINFO,
				text: err
			});
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