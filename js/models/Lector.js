var UUID = require('../utils/UUID');

module.exports = function(args){
	var args = args || {};

	this.id = args.id || UUID.generate();
	this.fullname = args.fullname || 'Нет имени';
	this.email = args.email || 'Нет электронного адреса';
	this.phone = args.phone || 'Нет телефона';
	this.href = args.href || '#';
}