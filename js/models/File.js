var UUID = require('../utils/UUID');
var FileTypes = require('../utils/event/FileTypes');

module.exports = function(args){
	args = args || {};

	this.id = args.id || UUID.generate();
	this.name = args.name || 'Нет названия';
	this.href = args.href || '#';
	this.type = args.type || FileTypes.keys.unknown;
	this.isDownload = args.isDownload || true;
}