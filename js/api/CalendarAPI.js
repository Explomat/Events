var Config = require('../config');
var Storage = require('../utils/Storage');
//var Calendar = require('../models/Calendar');
//var ShortEvent = require('../models/ShortEvent');
var Promise = require('es6-promise').Promise;
var Ajax = require('../utils/Ajax');

module.exports = {

	getData: function(){
		var calendarData = Storage.getItem('calendar');
		if (calendarData) return Promise.resolve(calendarData);
		
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getData'})).then(function(data){
			var calendarData = JSON.parse(data);
			Storage.setItem('calendar', calendarData);
			return calendarData;
		});
		/*return new Promise(function(resolve, reject){
			var settings = Storage.getItem('calendar');
			var data = new Calendar(settings);
			Storage.setItem('calendar', data);
			resolve(data);
		});*/
	},

	getEvents: function(year, month, businessType, region){
		return Ajax.sendRequest(Config.url.createPath({action_name: 'getEventsData', year: year, month: month + 1, business_type: businessType, region: region})).then(function(data){
			return JSON.parse(data);
		});

		/*return new Promise(function(resolve, reject){
			resolve([
				new ShortEvent({ name:'Первое мероприятие1', startDate: 'Sat, 16 Jan 2016 18:40:10 +0300', status: 'plan', place:'Москва' }),
				new ShortEvent({ name:'Второе мероприятие2', startDate: 'Tue, 19 Jan 2016 18:40:10 +0300', status: 'close', place:'Москва' }), 
				new ShortEvent({ name:'Третье мероприятие3', startDate: 'Tue, 5 Jan 2016 18:40:10 +0300', status: 'active', place:'Москва' }),
				new ShortEvent({ name:'Четвертое мероприятие4', startDate: 'Sun, 10 Jan 2016 18:40:10 +0300', status: 'active', place:'Москва' })  
			]);
		});*/
	},

	saveToStorage: function(calendarData){
		Storage.setItem('calendar', calendarData);
	}
}