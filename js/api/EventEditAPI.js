var Config = require('../config');
//var Promise = require('es6-promise').Promise;
var Ajax = require('../utils/Ajax');

module.exports = {

	getData: function(eventId){
		//return Promise.resolve({});
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getEventEditData', event_id: eventId}), null, false).then(function(data){
			return JSON.parse(data, (key, value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
		});
	},

	notificateItems: function(items, subject, body){
		var ids = items.map(function(item){
			return item.id;
		});
		return Ajax.sendRequest(Config.url.createPath({action_name: 'createNotification'}), JSON.stringify({ids: ids, subject: subject, body: body}), false, true, null, 'POST').then(function(data){
			return data;
		});
	}
}