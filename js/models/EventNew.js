import EventTypes from '../utils/eventedit/EventTypes';
import EventCodes from '../utils/eventedit/EventCodes';
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
		educationMethods: [],
		tutors: [],

		selectedType: null,
		selectedCode: null,
		selectedEducationOrgId: null,
		selectedEducationMethodId: null,
		selectedTutorId: null
	}

	this.dateTime = {
		startDateTime: new Date(),
		finishDateTime: new Date()
	}

	this.place = {
		places: [],
		selectedPlaceId: null,
		selectedPlaceValue: ''
	}

	this.tutors = {
		lector: new Lector()
	}
}