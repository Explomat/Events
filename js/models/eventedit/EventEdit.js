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
import SelectTestTypes from '../../utils/eventedit/SelectTestTypes';
import {every} from 'lodash';

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
		requestItems: [],

		//state fields
		sortTypes: [
			{ payload: '{"key": "fullname", "isAsc": "true"}', text: 'Сортировать по ФИО(по убыванию)' },
			{ payload: '{"key": "fullname", "isAsc": "false"}', text: 'Сортировать по ФИО(по возрастанию)' }
		],
		selectedPayload: '{"key": "fullname", "isAsc": "true"}'
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
		infoStatus: '',
		checkedTypes: [
			{ payload: '{"isAssist": "true"}', text: 'Выбрать всех присутствующих' }
		],
		sortTypes: [
			{ payload: '{"key": "fullname", "isAsc": "true"}', text: 'Сортировать по ФИО(по убыванию)' },
			{ payload: '{"key": "fullname", "isAsc": "false"}', text: 'Сортировать по ФИО(по возрастанию)' }
		],
		selectedPayload: '{"key": "fullname", "isAsc": "true"}'
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
		infoStatus: '',

		sortTutorTypes: [
			{ payload: '{"key": "fullname", "isAsc": "true"}', text: 'Сортировать по ФИО(по убыванию)' },
			{ payload: '{"key": "fullname", "isAsc": "false"}', text: 'Сортировать по ФИО(по возрастанию)' }
		],
		selectedTutorPayload: '{"key": "fullname", "isAsc": "true"}',
		checkedTutorTypes: [
			{ payload: '{"main": "true"}', text: 'Выбрать основного' }
		],
		sortLectorTypes: [
			{ payload: '{"key": "fullname", "isAsc": "true"}', text: 'Сортировать по ФИО(по убыванию)' },
			{ payload: '{"key": "fullname", "isAsc": "false"}', text: 'Сортировать по ФИО(по возрастанию)' }
		],
		selectedLectorPayload: '{"key": "fullname", "isAsc": "true"}'
	}
	if (args.tutors.tutors) {
		this.tutors.tutors = args.tutors.tutors.map(function(t){
			return new Tutor(t);
		});
		let isEveryNotMain = every(this.tutors.tutors, (t) => {
			return t.main === false;
		});
		if (isEveryNotMain) {
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

		//state fields
		checkedAll: false,
		testTypes: SelectTestTypes.toArray(),

		selectTypes: [
			{ payload: '{"type": "prev"}', text: 'Выбрать предварительные тесты' },
			{ payload: '{"type": "post"}', text: 'Выбрать пост-тесты' }
		],

		sortTestTypes: [
			{ payload: '{"key": "name", "isAsc": "true"}', text: 'Сортировать по имени(по убыванию)' },
			{ payload: '{"key": "name", "isAsc": "false"}', text: 'Сортировать по имени(по возрастанию)' },
			{ payload: '{"key": "type", "isAsc": "true"}', text: 'Сортировать по типу(по убыванию)' },
			{ payload: '{"key": "type", "isAsc": "false"}', text: 'Сортировать по типу(по возрастанию)' }
		],

		sortTypes: [
			{ payload: '{"key": "fullname", "isAsc": "true"}', text: 'Сортировать по ФИО(по убыванию)' },
			{ payload: '{"key": "fullname", "isAsc": "false"}', text: 'Сортировать по ФИО(по возрастанию)' }
		],
		selectedPayload: '{"key": "fullname", "isAsc": "true"}'
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