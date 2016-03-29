var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEditConstants = require('../constants/EventEditConstants');

var EventEditActions = {
	
	receiveData: function(data) {
		AppDispatcher.handleAction({
			actionType: EventEditConstants.RECEIVE_EVENTEDIT_DATA,
			data: data
		});
	},

	//BASE
	changeName: function(name){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_NAME,
			name: name
		});
	},
	changeType: function(type){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_TYPE,
			type: type
		});
	},
	changeCode: function(code){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_CODE,
			code: code
		});
	},
	changeStartDateTime: function(dateTime){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_START_DATETIME,
			dateTime: dateTime
		});
	},
	changeFinishDateTime: function(dateTime){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_FINISH_DATETIME,
			dateTime: dateTime
		});
	},
	changeEducationOrg: function(educationOrgId){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_EDUCATION_ORG,
			educationOrgId: educationOrgId
		});
	},
	changeEducationMethod: function(educationMethod){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_EDUCATION_METHOD,
			educationMethod: educationMethod
		});
	},
	changePlace: function(place){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_EVENTEDIT_PLACE,
			place: place
		});
	}
	//-----------------------------------------
}

module.exports = EventEditActions;