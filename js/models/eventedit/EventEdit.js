var CollaboratorRequest = require('./CollaboratorRequest');
var Collaborator = require('./Collaborator');
var Tutor = require('./Tutor');
var Lector = require('./Lector');
var CollaboratorTest = require('./CollaboratorTest');

module.exports = function(args){
	args = args || {};
	args.startDate = args.startDate || Date();
	args.finishDate = args.finishDate || Date();
	args.dateRequestBegin = args.dateRequestBegin || Date(); //период подачи заявок
	args.dateRequestOver = args.dateRequestOver || Date();

	this.id = args.id || null;

	//base settings
	this.name = args.name || 'Нет названия';
	this.types = args.types || [];
	this.codes = args.codes || [];
	this.isPublic = args.isPublic || false;
	this.startDate = new Date(args.startDate);
	this.startTime = args.startTime || '';
	this.finishDate = new Date(args.finishDate);
	this.finishTime = args.finishTime || '';
	this.educationMethod = args.educationMethod || null;
	this.educationOrg = args.educationOrg || null;
	this.place = args.place || '';

	//requests
	this.dateRequestBegin = new Date(args.dateRequestBegin);
	this.dateRequestOver = new Date(args.dateRequestOver);
	this.isDateRequestBeforeBegin = args.isDateRequestBeforeBegin || false; //подавать заявки до начала мероприятия
	this.isAutomaticIncludeInCollaborators = args.isAutomaticIncludeInCollaborators || false; //Автоматически включать в состав участников
	this.isApproveByBoss = args.isApproveByBoss || false; //Необходимо подтверждение от непосредсвенного руководителя
	this.isApproveByTutor = args.isApproveByTutor || false; //Необходимо подтверждение ответсвенного за мероприятие

	this.requestCollaborators = [];
	if (args.requestCollaborators) {
		this.requestCollaborators = args.requestCollaborators.map(function(rq){
			return new CollaboratorRequest(rq);
		});
	}

	//collaborators
	this.collaborators = [];
	if (args.collaborators) {
		this.collaborators = args.collaborators.map(function(col){
			return new Collaborator(col);
		});
	}

	//tutors
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

	//testing
	this.isAutoAssignPrevTesting = args.isAutoAssignPrevTesting || false;
	this.isAutoAssignPostTesting = args.isAutoAssignPostTesting || false;
	/*this.prevTests = [];
	if (args.prevTests) {
		this.prevTests = args.prevTests.map(function(t){
			return new Test(t);
		});
	}
	this.postTests = [];
	if (args.postTests) {
		this.postTests = args.postTests.map(function(t){
			return new Test(t);
		});
	}*/
	this.listOfTest = [];
	if (args.listOfTest) {
		this.listOfTest = args.listOfTest.map(function(lt){
			return new CollaboratorTest(lt);
		});
	}
}