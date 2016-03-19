var UUID = require('../utils/UUID');

module.exports = function(args){
	args = args || {};

	this.id = args.id || UUID.generate();
	this.region = args.region || '';
	this.businessType = args.businessType || '';
	this.actionsDenied = args.actionsDenied || [],
	this.componentsDenied = args.componentsDenied || []
}