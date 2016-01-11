module.exports = function(args){
	var args = args || {};

	this.name = args.name || '',
	this.actionsDenied = args.actionsDenied || [],
	this.componentsDenied = args.componentsDenied || [],
	this.priority = args.priority || 0;
}