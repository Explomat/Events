import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import EventEditConstants from '../constants/EventEditConstants';
import EventEdit from '../models/eventedit/EventEdit';
import extend from 'extend';

let _eventEdit = {};

function loadData(data) {
	_eventEdit = new EventEdit(data);
}

const base = {
	changeName(name){
		_eventEdit.base.name = name;
	},
	changeType(type){
		_eventEdit.base.selectedType = type;
	},
	changeCode(code){
		_eventEdit.base.selectedCode = code;
	},
	changeStartDateTime(dateTime){
		_eventEdit.base.startDateTime = dateTime;
	},
	changeFinishDateTime(dateTime){
		_eventEdit.base.finishDateTime = dateTime;
	},
	changeEducationOrg(educationOrgId){
		_eventEdit.base.selectedEducationOrgId = educationOrgId;
	},
	changeEducationMethod(educationMethod){
		_eventEdit.base.selectedEducationMethod = educationMethod;
	},
	changePlace(place){
		_eventEdit.base.places.selectedNode = place;
	}
}

const EventEditStore = extend({}, EventEmitter.prototype, {
	
	getData(){
		return {..._eventEdit};
	},

	getPartialData(key) {
		return {..._eventEdit[key]}
	},

	emitChange() {
		this.emit('change');
	},

	addChangeListener(callBack) {
		this.on('change', callBack);
	},

	removeChangeListener(callBack) {
		this.removeListener('change', callBack);
	}
});

EventEditStore.dispatchToken = AppDispatcher.register((payload) => {
	let action = payload.action;
	let isEmit = false;

	switch(action.actionType) {

		case EventEditConstants.RECEIVE_EVENTEDIT_DATA:
			loadData(action.data);
			isEmit = true;
			break;

		case EventEditConstants.CHANGE_EVENTEDIT_NAME:
			base.changeName(action.name);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_EVENTEDIT_TYPE:
			base.changeType(action.type);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_EVENTEDIT_CODE:
			base.changeCode(action.code);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_EVENTEDIT_START_DATETIME:
			base.changeStartDateTime(action.dateTime);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_EVENTEDIT_FINISH_DATETIME:
			base.changeFinishDateTime(action.dateTime);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_EVENTEDIT_EDUCATION_ORG:
			base.changeEducationOrg(action.educationOrgId);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_EVENTEDIT_EDUCATION_METHOD:
			base.changeEducationMethod(action.educationMethod);
			isEmit = true;
			break;
		case EventEditConstants.CHANGE_EVENTEDIT_PLACE:
			base.changePlace(action.place);
			isEmit = true;
			break;
		default:
			return true;
	}

	if (isEmit) EventEditStore.emitChange();
	return true;
});
export default EventEditStore;
