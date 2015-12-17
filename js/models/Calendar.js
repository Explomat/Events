var ShortEvent = require('./ShortEvent');

module.exports = function(args){
	var args = args || {};
	args.currentDate = args.currentDate || Date();
	
	if (args.events) {
		args.events.forEach(function(ev){
			ev.startDate = new Date(ev.startDate);
			ev.finishDate = new Date(ev.finishDate);
		});
	}

	this.currentDate = new Date(args.currentDate);
	this.events = args.events || [ 
		new ShortEvent({ name:'Первое мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'plan', place:'Москва' }),
		new ShortEvent({ name:'Второе мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'close', place:'Москва' }), 
		new ShortEvent({ name:'Третье мероприятие', startDate: 'Tue, 1 Dec 2015 18:40:10 +0300', status: 'active', place:'Москва' }) 
	];

	//Calculated fileds. For calendar view.
	this.selectedMonthIndex = this.currentDate.getMonth();
	this.selectedDate = this.currentDate;
}