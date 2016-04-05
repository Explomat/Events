var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEditConstants = require('../constants/EventEditConstants');
var EventEditAPI = require('../api/EventEditAPI');

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
		notificateItems(items, subject, body){
			EventEditAPI.notificateItems(items, subject, body).then(function(data){
				let message = data === '' ? 'Сообщение успешно отправлено.' : 'Произошла ошибка при отправке, проверьте подключение к сети.'
				let infoStatus = data === '' ? 'done' : 'error';
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE,
					infoMesage: message,
					infoStatus: infoStatus
				});
			}, function(/*err*/){

			})
			
		},
		changeInfoMessage(message){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE,
				infoMesage: message
			});
		},
		updateItems(items){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_UPDATE_ITEMS,
				items: items
			});
		}
	},

	tutors: {
		toggleTutorIsMain(id, main){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_TUTOR_IS_MAIN,
				id: id,
				main: main
			});
		},
		toggleTutorChecked(id, checked) {
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_TUTOR_CHECKED,
				id: id,
				checked: checked
			});
		},
		toggleLectorChecked(id, checked) {
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_LECTOR_CHECKED,
				id: id,
				checked: checked
			});
		},
		sortTutorsTable(key, isAsc){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_SORT_TUTORS_TABLE,
				key: key,
				isAsc: isAsc
			});
		},
		sortLectorsTable(key, isAsc){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_SORT_LECTORS_TABLE,
				key: key,
				isAsc: isAsc
			});
		},
		toggleCheckedAllTutors(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_TUTORS,
				checked: checked
			});
		},
		toggleCheckedAllLectors(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_LECTORS,
				checked: checked
			});
		},
		
		removeTutors(){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_REMOVE_TUTORS
			});
		},
		removeLectors(){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_REMOVE_LECTORS
			});
		},
		updateTutors(tutors){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_UPDATE_TUTORS,
				tutors: tutors
			});
		},
		updateLectors(lectors){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_UPDATE_LECTORS,
				lectors: lectors
			});
		}
	}
}

module.exports = EventEditActions;