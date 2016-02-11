module.exports = function(args){
	var args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || 'Нет имени';
	this.type = args.type || '';
}