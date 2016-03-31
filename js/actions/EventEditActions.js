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
	changeName(name){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_NAME,
			name: name
		});
	},
	changeType(type){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_TYPE,
			type: type
		});
	},
	changeCode(code){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_CODE,
			code: code
		});
	},
	changeStartDateTime(dateTime){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_START_DATETIME,
			dateTime: dateTime
		});
	},
	changeFinishDateTime(dateTime){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_FINISH_DATETIME,
			dateTime: dateTime
		});
	},
	changeEducationOrg(educationOrgId){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_EDUCATION_ORG,
			educationOrgId: educationOrgId
		});
	},
	changeEducationMethod(educationMethod){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_EDUCATION_METHOD,
			educationMethod: educationMethod
		});
	},
	changePlace(place){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_PLACE,
			place: place
		});
	},


	//REQUESTS
	changeIsDateRequestBeforeBegin(checked){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_IS_DATE_REQUEST_BEFORE_BEGIN,
			checked: checked
		});
	},
	changeRequestBeginDate(date){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_REQUEST_BEGIN_DATE,
			date: date
		});
	},
	changeRequestOverDate(date){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_REQUEST_OVER_DATE,
			date: date
		});
	},
	changeIsAutomaticIncludeInCollaborators(checked){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_IS_AUTOMATIC_INCLUDE_IN_COLLABORATORS,
			checked: checked
		});
	},
	changeIsApproveByBoss(checked){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_IS_APPROVE_BY_BOSS,
			checked: checked
		});
	},
	changeIsApproveByTutor(checked){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_IS_APPROVE_BY_TUTOR,
			checked: checked
		});
	},
	sortTable(key, isAsc){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.EVENTEDIT_SORT_TABLE,
			key: key,
			isAsc: isAsc
		});
	},
	changeRequestStatus(id, status){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.EVENTEDIT_CHANGE_REQUEST_STATUS,
			id: id,
			status: status
		});
	}
}

module.exports = EventEditActions;