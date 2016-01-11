var UUID = require('../utils/UUID');
var Group = require('./Group');

module.exports = function(args){
	var args = args || {};

	this.id = args.id || UUID.generate();
	this.group = args.group || new Group();
}