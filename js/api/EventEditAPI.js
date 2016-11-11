var Config = require('../config');
var Promise = require('es6-promise').Promise;
var Ajax = require('../utils/Ajax');
var expand = require('../utils/Object').expand;
/*var isNumberOrReal = require('../utils/validation/Validation').isNumberOrReal;*/

module.exports = {

	isDeniedActionAccess: function(id, action){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'isDeniedActionAccess', event_id: id, action: action}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	isEventEditing: function(eventId){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'isEventEditing', event_id: eventId}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''), (key, value) => {
				return value === 'true' ? true : value === 'false' ? false : value;
			});
		});
	},

	getData: function(eventId){
		//return Promise.resolve({});
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getEventEditData', event_id: eventId}), null, false).then(function(data){
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''), (key, value) => {
				/*if (key === 'id') return value;
				var val = isNumberOrReal(value) ? Number(value) : value;*/
				return value === 'true' ? true : value === 'false' ? false : value;
			});
		});
	},

	saveData: function(data){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'saveData'}), JSON.stringify(data), false, true, null, 'POST').then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	/*changeStatus: function(status){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'changeStatus'}), JSON.stringify({status: status}), false, true, null, 'POST').then((data) => {
			return JSON.parse(data);
		});
	},*/

	notificateItems: function(items, subject, body){
		var ids = items.map(function(item){
			return item.id;
		});
		return Ajax.sendRequest(Config.url.createPath({action_name: 'createNotification'}), JSON.stringify({ids: ids, subject: subject, body: body}), false, true, null, 'POST').then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''), (key, value) => {
				/*if (key === 'id') return value;
				var val = isNumberOrReal(value) ? Number(value) : value;*/
				return value === 'true' ? true : value === 'false' ? false : value;
			});
		});
	},

	changeRequestStatus: function(id, status, reason){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'processingRequest'}), JSON.stringify({id: id, status: status, reason: reason}), false, true, null, 'POST');
	},

	uploadFiles: function(curFiles, files, eventId){
		/*return Ajax.uploadFiles(Config.url.createPath({action_name: 'uploadFiles'}), files).then(function(files){
			return JSON.parse(files);
		});*/
		var promises = [];
		for (var i = files.length - 1; i >= 0; i--) {
			promises.push(Ajax.uploadFile(Config.url.createPath({action_name: 'uploadFile', event_id: eventId}), files[i]));
		};
		return Promise.all(promises).then(function(files){
			var parseFiles = files.map(function(f){
				return JSON.parse(f.replace(/\n/g, "\\\\n").replace(/\r/, ''));
			}).concat(curFiles);
			return Ajax.sendRequest(Config.url.createPath({action_name: 'addFiles', event_id: eventId}), JSON.stringify({files: parseFiles}), false, true, null, 'POST').then(function(data){
				return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
			});
		});
	},

	updateFiles: function (files, eventId) {
		return Ajax.sendRequest(Config.url.createPath({action_name: 'addFiles', event_id: eventId}), JSON.stringify({files: files}), false, true, null, 'POST').then(function(data){
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	removeFiles: function(ids, eventId){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'removeFiles', event_id: eventId}), JSON.stringify({ids: ids}), false, true, null, 'POST').then(function(_files){
			return JSON.parse(_files.replace(/\n/g, "\\\\n").replace(/\r/, ''));
			/*return files.map((file) => {
				return JSON.parse(file);
			});*/
		});
	},

	uploadLibraryMaterials: function(curFiles, files, eventId){
		var promises = [];
		for (var i = files.length - 1; i >= 0; i--) {
			promises.push(Ajax.uploadFile(Config.url.createPath({action_name: 'uploadLibraryMaterial', event_id: eventId}), files[i]));
		};
		return Promise.all(promises).then(function(files){
			var parseFiles = files.map(function(f){
				return JSON.parse(f.replace(/\n/g, "\\\\n").replace(/\r/, ''));
			}).concat(curFiles);
			return Ajax.sendRequest(Config.url.createPath({action_name: 'addLibraryMaterials', event_id: eventId}), JSON.stringify({files: parseFiles}), false, true, null, 'POST').then(function(data){
				return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
			});
		});
	},

	updateLibraryMaterials: function (libraryMaterials, eventId) {
		var materials = libraryMaterials.map(function(m){
			return expand(m);
		})
		return Ajax.sendRequest(Config.url.createPath({action_name: 'addLibraryMaterials', event_id: eventId}), JSON.stringify({files: materials}), false, true, null, 'POST').then(function(data){
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
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
				return JSON.parse(file.replace(/\n/g, "\\\\n").replace(/\r/, ''));
			});
		});
	}
}