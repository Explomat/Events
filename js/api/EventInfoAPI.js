var Config = require('../config');
var Storage = require('../utils/Storage');
var EventInfo = require('../models/EventInfo');
//var ShortEvent = require('../models/ShortEvent');
var Promise = require('es6-promise').Promise;
var Ajax = require('../utils/Ajax');

module.exports = {

	getData: function(id){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getEventInfo', id: id})).then(function(data){
			return JSON.parse(data)
		});
		/*return new Promise(function(resolve, reject){
			resolve(new EventInfo());
		});*/
	}
}