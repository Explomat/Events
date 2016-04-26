var Config = require('../config');
var Ajax = require('../utils/Ajax');

export default {

	getCollaborators(search){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getCollaboratorsForLiveSearch', search: search, limit: 10}), null, false).then((data) => {
			return JSON.parse(data);
		});
	}
}