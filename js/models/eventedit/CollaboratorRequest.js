module.exports = function(args){
	var args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || 'Нет имени';
	this.subdivision = args.subdivision || '';
	this.position = args.position || '';
	this.status = args.status || false;
}