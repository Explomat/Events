var EventTypes = require('../utils/event/EventTypes');	
var EventStatuses = require('../utils/event/EventStatuses');
var UUID = require('../utils/UUID');

module.exports = function(args){
	var args = args || {};

	this.id = args.id || UUID.generate();
	this.name = args.name || 'Нет названия';
	this.type = args.type || EventTypes.keys.full_time;
	this.startDate = args.startDate || Date();
	this.finishDate = args.finishDate || Date();
	this.status = args.status || EventStatuses.keys.plan;
	this.place = args.place || '';
}