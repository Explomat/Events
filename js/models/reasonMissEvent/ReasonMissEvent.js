import User from './User';
import Payload from './Payload';

module.exports = function(args) {
	args = args || {};
	args.reasons = args.reasons || {};

	this.users = [];
	if (args.users) {
		this.users = args.users.map(function(user){
			return new User(user);
		});
	}
	this.filteredUsers = [];
	if (args.users) {
		this.filteredUsers = args.users.map(function(user){
			return new User(user);
		});
	}

	this.reasons = {payloads: [], placeholders: []};
	this.reasons.payloads = args.reasons.payloads.map(function(p) {
		return new Payload(p);
	});
	this.reasons.placeholders = args.reasons.placeholders;
}