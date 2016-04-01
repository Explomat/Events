var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEditConstants = require('../constants/EventEditConstants');

var EventEditActions = {
	
	receiveData(data) {
		AppDispatcher.handleAction({
			actionType: EventEditConstants.RECEIVE_EVENTEDIT_DATA,
			data: data
		});
	},

	//BASE
	base: {
		changeName(name){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_NAME,
				name: name
			});
		},
		changeType(type){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_TYPE,
				type: type
			});
		},
		changeCode(code){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_CODE,
				code: code
			});
		},
		changeStartDateTime(dateTime){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_START_DATETIME,
				dateTime: dateTime
			});
		},
		changeFinishDateTime(dateTime){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_FINISH_DATETIME,
				dateTime: dateTime
			});
		},
		changeEducationOrg(educationOrgId){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_ORG,
				educationOrgId: educationOrgId
			});
		},
		changeEducationMethod(educationMethod){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_METHOD,
				educationMethod: educationMethod
			});
		},
		changePlace(place){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_PLACE,
				place: place
			});
		}
	},

	requests: {
		changeIsDateRequestBeforeBegin(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_DATE_REQUEST_BEFORE_BEGIN,
				checked: checked
			});
		},
		changeRequestBeginDate(date){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_BEGIN_DATE,
				date: date
			});
		},
		changeRequestOverDate(date){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_OVER_DATE,
				date: date
			});
		},
		changeIsAutomaticIncludeInCollaborators(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_AUTOMATIC_INCLUDE,
				checked: checked
			});
		},
		changeIsApproveByBoss(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_BOSS,
				checked: checked
			});
		},
		changeIsApproveByTutor(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_TUTOR,
				checked: checked
			});
		},
		sortRequestTable(key, isAsc){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_SORT_TABLE,
				key: key,
				isAsc: isAsc
			});
		},
		changeRequestStatus(id, status){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_STATUS,
				id: id,
				status: status
			});
		}
	},

	collaborators: {
		toggleIsAssist(id, isAssist){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_IS_ASSIST,
				id: id,
				isAssist: isAssist
			});
		},
		sortCollaboratorsTable(key, isAsc){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_SORT_TABLE,
				key: key,
				isAsc: isAsc
			});
		},
		toggleCheckedAll(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_ALL,
				checked: checked
			});
		},
		toggleChecked(id, checked) {
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED,
				id: id,
				checked: checked
			});
		},
		removeItems(){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_REMOVE_ITEMS
			});
		},
		notificateItems(){
			/*AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_NOTIFICATE_ITEMS,
			});*/
		},
		updateItems(items){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_UPDATE_ITEMS,
				items: items
			});
		}
	}
}

module.exports = EventEditActions;