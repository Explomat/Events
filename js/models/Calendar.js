var User = require('./User');
//var ShortEvent = require('./ShortEvent');
var DateUtils = require('../utils/event/DateUtils');
var EventUtils = require('../utils/event/EventUtils');
var CalendarEventStatuses = require('../utils/event/CalendarEventStatuses');
var CalendarBusinessTypes = require('../utils/event/CalendarBusinessTypes');

module.exports = function(args){
	args = args || {};
	args.currentDate = args.currentDate || Date();
	
	if (args.events) {
		args.events.forEach(function(ev){
			ev.startDate = new Date(ev.startDate);
			ev.finishDate = new Date(ev.finishDate);
		});
	}

	this.user = new User(args.user);
	this.currentDate = new Date(args.currentDate);
	this.events = args.events || [ 
		/*new ShortEvent({ name:'Первое мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'plan', place:'Москва' }),
		new ShortEvent({ name:'Первое1 мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'plan', place:'Москва' }),
		new ShortEvent({ name:'Первое2 мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'plan', place:'Москва' }),
		new ShortEvent({ name:'Второе мероприятие', startDate: 'Tue, 16 Dec 2015 18:40:10 +0300', status: 'close', place:'Москва' }), 
		new ShortEvent({ name:'Третье мероприятие', startDate: 'Tue, 1 Dec 2015 18:40:10 +0300', status: 'active', place:'Москва' }),
		new ShortEvent({ name:'Четвертое мероприятие', startDate: 'Tue, 10 Jan 2016 18:40:10 +0300', status: 'active', place:'Москва' })  */
	];
	this.filterEvents = this.events.slice(0);

	this.months = args.months || DateUtils.getMonths();
	this.years = args.years || DateUtils.getYears(this.currentDate.getFullYear());
	this.businessTypes = args.businessTypes || CalendarBusinessTypes.toArray();
	this.regions = EventUtils.prepareRegions(args.regions || []);
	this.statuses = args.statuses || CalendarEventStatuses.toArray();

	//Calculated fileds. For calendar view.
	this.selectedYear = args.selectedYear ? args.selectedYear : this.currentDate.getFullYear();
	this.selectedMonthIndex = (args.selectedMonthIndex !== undefined && args.selectedMonthIndex !== null) ? args.selectedMonthIndex : this.currentDate.getMonth();
	this.selectedDate = args.selectedDate ? new Date(args.selectedDate) : this.currentDate;
	this.selectedBusinessType = args.selectedBusinessType ? args.selectedBusinessType : this.user.businessType === '' ? CalendarBusinessTypes.keys.all : this.user.businessType;
	this.selectedRegion = args.selectedRegion || this.user.region;
	this.selectedStatus = args.selectedStatus ? args.selectedStatus : CalendarEventStatuses.keys.all;
	this.searchText = args.searchText ? args.searchText : '';
	this.isLoading = false;
}