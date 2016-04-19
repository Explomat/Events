var Config = require('../config');
var Promise = require('es6-promise').Promise;
var Ajax = require('../utils/Ajax');
var expand = require('../utils/Object').expand;

module.exports = {

	getData: function(eventId){
		//return Promise.resolve({});
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getEventEditData', event_id: eventId}), null, false).then(function(data){
			return JSON.parse(data, (key, value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
		});
	},

	saveData: function(data){
		Ajax.sendRequest(Config.url.createPath({action_name: 'saveData'}), JSON.stringify(data), false, true, null, 'POST');
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
		/*return Ajax.uploadFiles(Config.url.createPath({action_name: 'uploadFiles'}), files).then(function(files){
			return JSON.parse(files);
		});*/
		var promises = [];
		for (var i = files.length - 1; i >= 0; i--) {
			promises.push(Ajax.uploadFile(Config.url.createPath({action_name: 'uploadFile'}), files[i]));
		};
		return Promise.all(promises).then(function(files){
			var parseFiles = files.map(function(f){
				return JSON.parse(f);
			})
			return Ajax.sendRequest(Config.url.createPath({action_name: 'addFiles'}), JSON.stringify({files: parseFiles}), false, true, null, 'POST').then(function(data){
				return JSON.parse(data);
			});
		});
	},

	updateFiles: function (files) {
		return Ajax.sendRequest(Config.url.createPath({action_name: 'addFiles'}), JSON.stringify({files: files}), false, true, null, 'POST').then(function(data){
			return JSON.parse(data);
		});
	},

	removeFiles: function(ids){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'removeFiles'}), JSON.stringify({ids: ids}), false, true, null, 'POST').then(function(_files){
			return JSON.parse(_files);
			/*return files.map((file) => {
				return JSON.parse(file);
			});*/
		});
	},

	uploadLibraryMaterials: function(files){
		var promises = [];
		for (var i = files.length - 1; i >= 0; i--) {
			promises.push(Ajax.uploadFile(Config.url.createPath({action_name: 'uploadLibraryMaterial'}), files[i]));
		};
		return Promise.all(promises).then(function(files){
			var parseFiles = files.map(function(f){
				return JSON.parse(f);
			})
			return Ajax.sendRequest(Config.url.createPath({action_name: 'addLibraryMaterials'}), JSON.stringify({files: parseFiles}), false, true, null, 'POST').then(function(data){
				return JSON.parse(data);
			});
		});
	},

	updateLibraryMaterials: function (libraryMaterials) {
		var materials = libraryMaterials.map(function(m){
			return expand(m);
		})
		return Ajax.sendRequest(Config.url.createPath({action_name: 'addLibraryMaterials'}), JSON.stringify({files: materials}), false, true, null, 'POST').then(function(data){
			return JSON.parse(data);
		});

		/*var promises = [];
		for (var i = libraryMaterials.length - 1; i >= 0; i--) {
			promises.push(Ajax.sendRequest(Config.url.createPath({action_name: 'addLibraryMaterials'}), JSON.stringify(libraryMaterials[i]), false, true, null, 'POST'));
		};
		return Promise.all(promises).then(function(libraryMaterials){
			return libraryMaterials.map((libraryMaterial) => {
				return JSON.parse(libraryMaterial);
			});
		});*/
	},

	removeLibraryMaterials: function(ids){
		var promises = [];
		for (var i = ids.length - 1; i >= 0; i--) {
			promises.push(Ajax.sendRequest(Config.url.createPath({action_name: 'removeLibraryMaterials', id: ids[i]}), null, false, true, null, 'POST'));
		};
		return Promise.all(promises).then(function(files){
			return files.map((file) => {
				return JSON.parse(file);
			});
		});
	}
}