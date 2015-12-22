var UUID = require('../utils/UUID');

module.exports = function(args){
	var args = args || {};

	this.id = args.id || UUID.generate();
	this.fullname = args.fullname || 'Нет имени';
}