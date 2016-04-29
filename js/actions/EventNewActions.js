import AppDispatcher from '../dispatcher/AppDispatcher';
import EventNewConstants from '../constants/EventNewConstants';
/*import EventNewAPI from '../api/EventNewAPI';*/

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
		selectEducationMethod(id, value){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_EDUCATION_METHOD,
				id: id,
				value: value
			});
		},
		selectTutor(id, value){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_TUTOR,
				id: id,
				value: value
			});
		},
		changeMaxPersonNum(num){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_MAX_PERSON_NUM,
				num: num
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