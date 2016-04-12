module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || '';
	this.assessmentName = args.assessmentName || '';
	this.score = args.score || '';
}