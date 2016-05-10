import EventTypes from '../../utils/eventedit/EventTypes';
import EventCodes from '../../utils/eventedit/EventCodes';
import LectorTypes from '../../utils/eventedit/LectorTypes';
import LectorSelectTypes from '../../utils/eventnew/LectorSelectTypes';
import Lector from './Lector';

module.exports = function(args) {
	args = args || {};
	args.base = args.base || {};
	args.placeAndDateTime = args.placeAndDateTime || {};
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
		tutorValue: null
	}

	this.placeAndDateTime = {
		startDateTime: new Date(),
		finishDateTime: new Date(),
		placeId: null,
		placeValue: null
	}

	this.lectors = {
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

	this.complete = {
		id: null,
		error: null,
		isLoading: false
	}
}