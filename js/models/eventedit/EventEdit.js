import CollaboratorRequest from './CollaboratorRequest';
import Collaborator from './Collaborator';
import Tutor from './Tutor';
import Lector from './Lector';
import Test from './Test';
import File from './File';
import LibraryMaterial from './LibraryMaterial';
import CollaboratorTest from './CollaboratorTest';
import CollaboratorCourse from './CollaboratorCourse';
import Places from './Places';
import EventTypes from '../../utils/eventedit/EventTypes';
import EventCodes from '../../utils/eventedit/EventCodes';
import {every} from 'lodash';

function getBoolean(arg){
	return (arg === undefined || arg === null) ? false : arg;
}

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
	this.status = args.status || null;
	this.infoMessage = '';
	this.infoStatus = '';

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
		maxPersonNum: args.maxPersonNum || '',

		selectedType: args.base.selectedType,
		selectedCode: args.base.selectedCode,
		selectedEducationMethod: args.base.selectedEducationMethod,
		selectedEducationOrgId: args.base.selectedEducationOrgId
	}

	//requests
	this.requests = {
		isOpen: getBoolean(args.requests.isOpen), //подавать заявки до начала мероприятия
		requestBeginDate: new Date(args.requests.requestBeginDate),
		requestOverDate: new Date(args.requests.requestOverDate),
		/*isAutomaticIncludeInCollaborators: getBoolean(args.requests.isAutomaticIncludeInCollaborators), //Автоматически включать в состав участников*/
		isApproveByBoss: getBoolean(args.requests.isApproveByBoss), //Необходимо подтверждение от непосредсвенного руководителя
		isApproveByTutor: getBoolean(args.requests.isApproveByTutor), //Необходимо подтверждение ответсвенного за мероприятие
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
	if (args.tutors.tutors) {
		this.tutors.tutors = args.tutors.tutors.map(function(t){
			return new Tutor(t);
		});
		let isEveryNotMain = every(this.tutors.tutors, (t) => {
			return t.main === false;
		});
		if (isEveryNotMain && this.tutors.tutors.length > 0) {
			this.tutors.tutors[0].main = true;
		}
	}
	if (args.tutors.lectors) {
		this.tutors.lectors = args.tutors.lectors.map(function(l){
			return new Lector(l);
		});
	}

	//testing
	this.testing = {
		allTests: [],
		testingList:[],
		isPostTestOnlyForAssisst: args.testing.isPostTestOnlyForAssisst || false,
		thresholds: args.testing.thresholds || [], //пороговые значения для отображения результатов тестов
		thresholdColors: ['#ff5252', '#ffb300', '#4CAF50'],

		//state fields
		checkedAll: false
	}
	
	if (args.testing.allTests) {
		this.testing.allTests = args.testing.allTests.map(function(t){
			return new Test(t);
		});
	}

	if (args.testing.testingList) {
		this.testing.testingList = args.testing.testingList.map(function(lt){
			return new CollaboratorTest(lt);
		});
	}

	this.courses = {
		courses: []
	}
	if (args.courses.courses) {
		this.courses.courses = args.courses.courses.map(function(c){
			return new CollaboratorCourse(c);
		});
	}

	this.files = {

		files: [],
		libraryMaterials: [],
		isSendBeforeDocHref: args.files.isSendBeforeDocHref,
		isSendAfterDocHref: args.files.isSendAfterDocHref,

		//state fields
		checkedAllFiles: false,
		checkedAllLibraryMaterials: false,
		isUploadingFiles: false,
		isUploadingLibraryMaterials: false,
		infoMessageDownloadLibraryMaterials: '',
		infoStatusDownloadLibraryMaterials: ''
	}

	if (args.files.files) {
		this.files.files = args.files.files.map(function(f){
			return new File(f);
		});
	}
	if (args.files.libraryMaterials) {
		this.files.libraryMaterials = args.files.libraryMaterials.map(function(l){
			return new LibraryMaterial(l);
		});
	}
}