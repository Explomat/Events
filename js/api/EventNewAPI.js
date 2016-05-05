var Config = require('../config');
var Ajax = require('../utils/Ajax');

module.exports = {

	getData(){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getDataForNewEvent'}), null, false).then((data) => {
			return JSON.parse(data);
		});
	},

	saveEvent(data){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'saveNewEvent'}), JSON.stringify(data), false, true, null, 'POST').then((data) => {
			return JSON.parse(data);
		});
	},

	getPlaces(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetPlaces', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data);
		});
	},

	getEducationMethods(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetEducationMethods', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data);
		});
	},

	getLectors(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetLectors', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data);
		});
	},

	getCollaborators(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'forLiveSearchGetCollaborators', search: search, limit: 5}), null, false).then((data) => {
			return JSON.parse(data);
		});
	}
}