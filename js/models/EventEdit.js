var EventTypes = require('../utils/event/EventTypes');	
var EventUtils = require('..//utils/event/EventUtils');
var Collaborator = require('./Collaborator');
var WebinarInfo = require('./WebinarInfo');
var Tutor = require('./Tutor');
var Lector = require('./Lector');
var File = require('./File');
var UUID = require('../utils/UUID');

module.exports = function(args){
	var args = args || {};
	args.startDate = args.startDate || Date();
	args.finishDate = args.finishDate || Date();

	this.id = args.id || null;

	//base settings
	this.name = args.name || 'Нет названия';
	this.type = args.type || EventTypes.keys.full_time;
	this.codes = args.codes || [];
	this.startDate = new Date(args.startDate);
	this.startTime = args.startTime || '';
	this.finishDate = new Date(args.finishDate);
	this.finishTime = args.finishTime || '';
	this.place = args.place || '';
	this.reportHref = args.reportHref || "#";

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