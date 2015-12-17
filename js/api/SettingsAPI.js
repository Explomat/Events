var Config = require('../config');
var Storage = require('../utils/Storage');
var Calendar = require('../models/Calendar');

module.exports = {

	getSettingsData: function(){
		var settings = Storage.getItem('settings');
		var data = new Calendar(settings);
		Storage.setItem('settings', data);
		return data;
	}
}