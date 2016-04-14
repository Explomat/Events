module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.name = args.name || '';
	this.year = args.year || '';
	this.author = args.author || '';

	//state fieds
	this.checked = false;
	this.error = '';
}