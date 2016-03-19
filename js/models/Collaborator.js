var UUID = require('../utils/UUID');

module.exports = function(args){
	args = args || {};

	this.id = args.id || UUID.generate();
	this.fullname = args.fullname || 'Нет имени';
	this.href = args.href || '#';
	this.imgHref = args.imgHref || '#';
}