module.exports = function(args){
	args = args || {};
	args.finishDate = args.finishDate || Date();

	this.id = args.id || null;
	this.fullname = args.fullname || 'Нет имени';
	this.type = args.type || '';
	this.finishDate = new Date(args.finishDate);
	this.result = args.result || '';

	//state fields
	this.checked = false;
}