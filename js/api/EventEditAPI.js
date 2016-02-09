var Config = require('../config');
var Ajax = require('../utils/Ajax');

module.exports = {

	getData: function(eventId){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getEventEdit', event_id: eventId}), null, false).then(function(data){
			return JSON.parse(data);
		});
	}
}