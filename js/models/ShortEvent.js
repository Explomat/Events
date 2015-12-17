var EventTypes = require('../utils/event/EventTypes');	
var EventStatuses = require('../utils/event/EventStatuses');
var UUID = require('../utils/UUID');

module.exports = function(args){
	var args = args || {};
	args.startDate = args.startDate || Date();
	args.finishDate = args.finishDate || Date();

	this.id = args.id || UUID.generate();
	this.name = args.name || 'Нет названия';
	this.type = args.type || EventTypes.keys.full_time;
	this.startDate = new Date(args.startDate);
	this.finishDate = new Date(args.finishDate);
	this.status = args.status || EventStatuses.keys.plan;
	this.place = args.place || '';
}