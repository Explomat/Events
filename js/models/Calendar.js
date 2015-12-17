var ShortEvent = require('./ShortEvent');

module.exports = function(args){
	var args = args || {};

	this.currentDate = args.currentDate || Date();
	this.events = args.events || [ 
		new ShortEvent({ name:'Первое мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'plan', place:'Москва' }),
		new ShortEvent({ name:'Второе мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'close', place:'Москва' }), 
		new ShortEvent({ name:'Третье мероприятие', startDate: 'Tue, 1 Dec 2015 18:40:10 +0300', status: 'active', place:'Москва' }) 
	];
}