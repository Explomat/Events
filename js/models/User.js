var UUID = require('../utils/UUID');

module.exports = function(args){
	var args = args || {};

	this.id = args.id || UUID.generate();
	this.businessType = args.businessType || '';
	this.actionsDenied = args.actionsDenied || [],
	this.componentsDenied = args.componentsDenied || []
}