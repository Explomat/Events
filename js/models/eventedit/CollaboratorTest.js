module.exports = function(args){
	args = args || {};
	args.finishDate = args.finishDate || Date();

	this.id = args.id || null;
	this.fullname = args.fullname || 'Нет имени';
	this.testType = args.testType || '';
	this.finishDate = new Date(args.finishDate);
	this.result = args.result || '';
}