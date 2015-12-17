var Config = require('../config');
var Storage = require('../utils/Storage');
var Calendar = require('../models/Calendar');

module.exports = {

	getData: function(){
		var settings = Storage.getItem('calendar');
		var data = new Calendar(settings);
		Storage.setItem('calendar', data);
		return data;
	}
}