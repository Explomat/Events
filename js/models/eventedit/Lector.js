module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.fullname = args.fullname || '';
	this.type = args.type || '';

	//state fields
	this.checked = false;
}