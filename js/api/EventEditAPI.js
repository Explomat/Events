var Config = require('../config');
var Promise = require('es6-promise').Promise;
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
		return Ajax.sendRequest(Config.url.createPath({action_name: 'createNotification'}), JSON.stringify({ids: ids, subject: subject, body: body}), false, true, null, 'POST');
	},

	changeRequestStatus: function(id, status, reason){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'processingRequest'}), JSON.stringify({id: id, status: status, reason: reason}), false, true, null, 'POST');
	},

	uploadFiles: function(files){
		var promises = [];
		for (var i = files.length - 1; i >= 0; i--) {
			promises.push(Ajax.uploadFile(Config.url.createPath({action_name: 'uploadFile'}), files[i]));
		};
		return Promise.all(promises).then(function(files){
			var arr = [];
			files.forEach((file) => {
				arr.push(JSON.parse(file));
			});
			return arr;
			//return JSON.parse(data);
		});
		/*return Ajax.uploadFile(Config.url.createPath({action_name: 'uploadFile'}), file).then(function(data){
			return JSON.parse(data);
		});*/
	},

	removeFile: function(id){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'removeFile', id: id }), null, false).then(function(data){
			return JSON.parse(data);
		});
	}
}