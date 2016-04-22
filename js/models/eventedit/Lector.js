module.exports = function(args){
	args = args || {};

	this.id = args.id || null;
	this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.middleName = args.middleName;
	this.type = args.type || '';

	//state fields
	this.checked = false;

	//server fields for new lector
	this.email = '';
    this.company = '';
	this.isNew = false;
}