module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.name = args.name || '';
	this.type = args.type || '';
	this.isAllowDownload = args.isAllowDownload || false;

	//state fieds
	this.checked = false;
	this.error = '';
}