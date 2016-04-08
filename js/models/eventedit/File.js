module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.name = args.name || '';

	//state fieds
	this.isUploading = false;
	this.error = '';
}