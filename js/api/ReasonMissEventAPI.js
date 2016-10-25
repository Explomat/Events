var Config = require('../config');
var Ajax = require('../utils/Ajax');

module.exports = {

	isDeniedActionAccess(action){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'isDeniedActionAccess', action: action}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	getData(){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getDataReasonMissEvent'}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	removeUser(event_result_id, reason_type, reason){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'removeUser'}), JSON.stringify({event_result_id: event_result_id, reason_type: reason_type, reason: reason}), false, false, null, 'POST').then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	}
}