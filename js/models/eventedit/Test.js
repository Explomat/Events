module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.name = args.name || '';
	this.code = args.code || '';
	this.type = args.type || '';

	//state fields
	this.checked = false;
}