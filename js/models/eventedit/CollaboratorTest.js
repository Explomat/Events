module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || '';
	this.assessmentName = args.assessmentName || '';
	this.score = args.score || 0;
	this.maxscore = (args.maxscore === 0 || !args.maxscore) ? 1 : args.maxscore ;

	//state fields
	this.percent = (100.0 / this.maxscore) * this.score;
}