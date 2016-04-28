var Config = require('../config');
var Ajax = require('../utils/Ajax');

module.exports = {

	getData(){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getDataForNewEvent'}), null, false).then((data) => {
			return JSON.parse(data);
		});
	},

	getPlaces(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getPlacesForLiveSearch', search: search, limit: 10}), null, false).then((data) => {
			return JSON.parse(data);
		});
	}
}