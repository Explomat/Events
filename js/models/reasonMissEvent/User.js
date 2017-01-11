import tryDateParse from '../../utils/tryDateParse';

module.exports = function(args) {
	args = args || {};

	this.userName = args.userName || '';
	this.eventName = args.eventName || '';
	this.eventDate = tryDateParse(args.eventDate);
	this.eventResultID = args.eventResultID || '';
}