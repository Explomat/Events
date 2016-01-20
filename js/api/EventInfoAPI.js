var Config = require('../config');
var Storage = require('../utils/Storage');
//var EventInfo = require('../models/EventInfo');
//var ShortEvent = require('../models/ShortEvent');
var Promise = require('es6-promise').Promise;
var Ajax = require('../utils/Ajax');

module.exports = {

	getData: function(eventId){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getEventInfo', event_id: eventId}), null, false).then(function(data){
			try {
				return JSON.parse(data);
			}
			catch(e){}
		});
	},

	createRequest: function(eventId){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'createRequest', event_id: eventId})).then(function(error){
			return error;
		});
	},

	removeCollaborator: function(eventId) {
		return Ajax.sendRequest(Config.url.createPath({action_name: 'removeCollaborator', event_id: eventId})).then(function(error){
			return error;
		});
	},

	startEvent: function(eventId) {
		return Ajax.sendRequest(Config.url.createPath({action_name: 'startEvent', event_id: eventId})).then(function(error){
			return error;
		});
	},

	finishEvent: function(eventId) {
		return Ajax.sendRequest(Config.url.createPath({action_name: 'finishEvent', event_id: eventId})).then(function(error){
			return error;
		});
	}
}