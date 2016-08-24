var Config = require('../config');
var Ajax = require('../utils/Ajax');

module.exports = {

	isDeniedActionAccess(action){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'isDeniedActionAccess', action: action}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	getData(){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getDataForNewEvent'}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	saveEvent(data){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'createEvent'}), JSON.stringify(data), false, true, null, 'POST').then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	getPlaces(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetPlaces', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	getEducationMethods(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetEducationMethods', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	getLectors(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetLectors', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	},

	getCollaborators(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetCollaborators', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/, ''));
		});
	}
}