import CollaboratorRequest from './CollaboratorRequest';
import Collaborator from './Collaborator';
import Tutor from './Tutor';
import Lector from './Lector';
import Test from './Test';
import CollaboratorTest from './CollaboratorTest';
import Places from './Places';
import EventTypes from '../../utils/eventedit/EventTypes';
import EventCodes from '../../utils/eventedit/EventCodes';

export default function(args){
	args = args || {};
	args.base = args.base || {};
	args.requests = args.requests || {};
	args.collaborators = args.collaborators || {};
	args.testing = args.testing || {};
	args.courses = args.courses || {};
	args.files = args.files || {};

	args.base.startDateTime = args.base.startDateTime || Date();
	args.base.finishDateTime = args.base.finishDateTime || Date();
	args.requests.requestBeginDate = args.requests.requestBeginDate || Date(); //период подачи заявок
	args.requests.requestOverDate = args.requests.requestOverDate || Date();

	this.id = args.id || null;

	//base settings
	this.base = {
		name: args.base.name || '',
		types: args.base.types || EventTypes.toArray(),
		codes: args.base.codes || EventCodes.toArray(),
		isPublic: args.base.isPublic || false,
		startDateTime: new Date(args.base.startDateTime),
		finishDateTime: new Date(args.base.finishDateTime),
		educationOrgs: (args.base.educationOrgs || []).map(item => {
			return {
				payload: item.id,
				text: item.name
			}
		}),
		places: Places(args.base.places),

		selectedType: args.base.selectedType,
		selectedCode: args.base.selectedCode,
		selectedEducationMethod: args.base.selectedEducationMethod,
		selectedEducationOrgId: args.base.selectedEducationOrgId
	}

	//requests
	this.requests = {
		isDateRequestBeforeBegin: args.requests.isDateRequestBeforeBegin || true, //подавать заявки до начала мероприятия
		requestBeginDate: new Date(args.requests.requestBeginDate),
		requestOverDate: new Date(args.requests.requestOverDate),
		isAutomaticIncludeInCollaborators: args.requests.isAutomaticIncludeInCollaborators || false, //Автоматически включать в состав участников
		isApproveByBoss: args.requests.isApproveByBoss || false, //Необходимо подтверждение от непосредсвенного руководителя
		isApproveByTutor: args.requests.isApproveByTutor || false, //Необходимо подтверждение ответсвенного за мероприятие
		requestItems: []
	}
	if (args.requests.requestItems) {
		this.requests.requestItems = args.requests.requestItems.map((rq) => {
			return new CollaboratorRequest(rq);
		});
	}

	//collaborators
	this.collaborators = {
		collaborators: [],
		
		//state fields
		checkedAll: false,
		infoMessage: '',
		infoStatus: ''
	}
	if (args.collaborators) {
		this.collaborators.collaborators = args.collaborators.map(function(col){
			return new Collaborator(col);
		});
	}

	//tutors
	this.tutors = {
		tutors: [],
		lectors: [],

		//state fields
		checkedAllTutors: false,
		checkedAllLectors: false,
		infoMessage: '',
		infoStatus: ''
	}
	if (args.tutors) {
		this.tutors.tutors = args.tutors.tutors.map(function(t){
			return new Tutor(t);
		});
	}
	if (args.lectors) {
		this.tutors.lectors = args.tutors.lectors.map(function(l){
			return new Lector(l);
		});
	}

	//testing
	this.testing = {
		isPrevTests: args.testing.isPrevTests || false,
		isPostTests: args.testing.isPostTests || false,
		isPostTestOnlyForAssisst: args.testing.isPostTestOnlyForAssisst || false
	}
	
	this.testing.prevTests = [];
	if (args.testing.prevTests) {
		this.testing.prevTests = args.testing.prevTests.map(function(t){
			return new Test(t);
		});
	}
	this.testing.postTests = [];
	if (args.testing.postTests) {
		this.testing.postTests = args.testing.postTests.map(function(t){
			return new Test(t);
		});
	}
	this.testing.testingList = [];
	if (args.testing.testingList) {
		this.testing.testingList = args.testing.testingList.map(function(lt){
			return new CollaboratorTest(lt);
		});
	}
}