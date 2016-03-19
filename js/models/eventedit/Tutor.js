module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || 'Нет имени';
	this.subdivision = args.subdivision || '';
	this.position = args.position || '';
	this.isMain = args.isMain || false;
}