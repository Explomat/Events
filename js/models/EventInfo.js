var EventTypes = require('../utils/event/EventTypes');	
var EventStatuses = require('../utils/event/EventStatuses');
var EventUtils = require('..//utils/event/EventUtils');
var Collaborator = require('./Collaborator');
var WebinarInfo = require('./WebinarInfo');
var Tutor = require('./Tutor');
var Lector = require('./Lector');
var File = require('./File');
var UUID = require('../utils/UUID');

module.exports = function(args){
	args = args || {};
	args.startDate = args.startDate || Date();
	args.finishDate = args.finishDate || Date();

	this.id = args.id || UUID.generate();
	this.name = args.name || 'Нет названия';
	this.type = args.type || EventTypes.keys.full_time;
	this.startDate = new Date(args.startDate);
	this.finishDate = new Date(args.finishDate);
	this.status = args.status || EventStatuses.keys.plan;
	this.place = args.place || '';
	this.reportHref = args.reportHref || '#';
	this.componentsDenied = args.componentsDenied || [];

	this.collaborators = [];
	if (args.collaborators) {
		this.collaborators = args.collaborators.map(function(col){
			return new Collaborator(col);
		});
	}
	this.tutors = [];
	if (args.tutors) {
		this.tutors = args.tutors.map(function(t){
			return new Tutor(t);
		});
	}
	this.lectors = [];
	if (args.lectors) {
		this.lectors = args.lectors.map(function(l){
			return new Lector(l);
		});
	}

	this.files = [];
	if (args.files) {
		this.files = args.files.map(function(f){
			return new File(f);
		});
	}

	//
	this.members = args.members || EventUtils.getMembers();
	this.webinarInfo = args.webinarInfo ? new WebinarInfo(args.webinarInfo) : null;
}