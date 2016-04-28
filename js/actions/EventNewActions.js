import AppDispatcher from '../dispatcher/AppDispatcher';
import EventNewConstants from '../constants/EventNewConstants';
import EventNewAPI from '../api/EventNewAPI';

module.exports = {

	receiveData(data){
		AppDispatcher.handleAction({
			actionType: EventNewConstants.EVENT_NEW_RECEIVE_DATA,
			data: data
		});
	},

	base: {
		changeName(name) {
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_NAME,
				name: name
			});
		},
		changeType(type){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_TYPE,
				type: type
			});
		},
		changeCode(code){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_CODE,
				code: code
			});
		},
		changeEducationOrg(orgId){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_EDUCATION_ORG,
				orgId: orgId
			});
		},
		getEducationMethods(filterText){
			EventNewAPI.getEducationMethods(filterText).then((educationMethods) => {
				AppDispatcher.handleAction({
					actionType: EventNewConstants.EVENT_NEW_GET_EDUCATION_METHODS,
					educationMethods: educationMethods
				});
			});
		},
		getTutors(filterText){
			EventNewAPI.getCollaborators(filterText).then((tutors) => {
				AppDispatcher.handleAction({
					actionType: EventNewConstants.EVENT_NEW_GET_TUTORS,
					tutors: tutors
				});
			});
		}
	},

	dateTime: {
		changeStartDatetime(dateTime){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_START_DATE_TIME,
				dateTime: dateTime
			});
		},
		changeFinishDateTime(dateTime){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_START_FINISH_TIME,
				dateTime: dateTime
			});
		}
	},

	place: {
		getPlaces(filterText){
			EventNewAPI.getPlaces(filterText).then((places) => {
				AppDispatcher.handleAction({
					actionType: EventNewConstants.EVENT_NEW_GET_PLACES,
					places: places
				});
			});
		},

		selectPlace(id, value){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_PLACE,
				id: id,
				value: value
			});
		}
	},

	tutors: {

	},

	organizer: {

	}
}