import EventTypes from '../utils/eventedit/EventTypes';
import EventCodes from '../utils/eventedit/EventCodes';
import LectorTypes from '../utils/eventedit/LectorTypes';
import LectorSelectTypes from '../utils/eventnew/LectorSelectTypes';
import Lector from './eventedit/Lector';

module.exports = function(args) {
	args = args || {};
	args.base = args.base || {};
	args.dateTime = args.dateTime || {};
	args.place = args.place || {};
	args.tutors = args.tutors || {};
	args.organizer = args.organizer || {};

	this.base = {
		name: '',
		types: EventTypes.toArray(),
		codes: EventCodes.toArray(),
		educationOrgs: (args.base.educationOrgs || []).map(item => {
			return {
				payload: item.id,
				text: item.name
			}
		}),

		type: null,
		code: null,
		educationOrgId: null,
		educationMethodId: null,
		educationMethodValue: null,
		tutorId: null,
		tutorValue: null,
		maxPersonNum: ''
	}

	this.placeAndDateTime = {
		startDateTime: new Date(),
		finishDateTime: new Date(),
		placeId: null,
		placeValue: null
	}

	this.tutors = {
		innerListLectorId: null,
		innerListLectorFullname: null,
		innerNewLectorId: null,
		innerNewLectorFullname: null,
		outerListLectorId: null,
		outerListLectorFullname: null,

		lector: new Lector(),

		//state fields
		lectorSelectedType: LectorTypes.keys.collaborator,
		lectorAddSelectedType: LectorSelectTypes.keys.select,
		lectorSearchType: LectorSelectTypes.keys.select
	}
}