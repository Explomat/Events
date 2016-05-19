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

	disposeData(){
		AppDispatcher.handleAction({
			actionType: EventNewConstants.EVENT_NEW_DISPOSE_DATA
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
		}
	},

	placeAndDateTime: {
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
		selectLectorType(lectorType) {
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_LECTOR_TYPE,
				lectorType: lectorType
			});
		},
		selectAddLectorType(lectorType) {
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_ADD_LECTOR_TYPE,
				lectorType: lectorType
			});
		},
		selectSearchLectorType(lectorType) {
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_SEARCH_LECTOR_TYPE,
				lectorType: lectorType
			});
		},
		selectInnerListLector(id, value){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_INNER_LIST_LECTOR,
				id: id,
				value: value
			});
		},
		selectInnerNewLector(id, value){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_INNER_NEW_LECTOR,
				id: id,
				value: value
			});
		},
		selectOuterListLector(id, value){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_SELECT_OUTER_LIST_LECTOR,
				id: id,
				value: value
			});
		},

		changeLectorFirstName(firstName){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_LECTOR_FIRST_NAME,
				firstName: firstName
			});
		},
		changeLectorLastName(lastName){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_LECTOR_LAST_NAME,
				lastName: lastName
			});
		},
		changeLectorMiddleName(middleName){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_LECTOR_MIDDLE_NAME,
				middleName: middleName
			});
		},
		changeLectorEmail(email){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_LECTOR_EMAIL,
				email: email
			});
		},
		changeLectorCompany(company){
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_CHANGE_LECTOR_COMPANY,
				company: company
			});
		}
	},

	complete: {
		saveEvent(data){
			return EventNewAPI.saveEvent(data);
		}
	}
}