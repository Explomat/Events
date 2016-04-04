module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || 'Нет имени';
	this.subdivision = args.subdivision || '';
	this.position = args.position || '';
	this.isAssist = args.isAssist || false;

	//state fields
	this.checked = false;
}