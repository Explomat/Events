module.exports = function(args) {
	args = args || {};

	this.userName = args.userName || '';
	this.eventName = args.eventName || '';
	this.eventDate = args.eventDate || '';
	this.eventResultID = args.eventResultID || '';
}