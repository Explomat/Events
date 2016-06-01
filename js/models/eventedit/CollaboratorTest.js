var ceil = require('lodash/ceil');

module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || '';
	this.region = args.region || '';
	this.assessmentName = args.assessmentName || '';
	this.score = Number(args.score) || 0;
	this.maxscore = (Number(args.maxscore) === 0 || !args.maxscore) ? 1 : Number(args.maxscore) ;

	//state fields
	this.percent = ceil((100.0 / this.maxscore) * this.score, 1);
}