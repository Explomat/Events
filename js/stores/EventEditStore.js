import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import EventEditConstants from '../constants/EventEditConstants';
import EventEdit from '../models/eventedit/EventEdit';
import extend from 'extend';
import {find, filter, every} from 'lodash';

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
		_eventEdit.base.startDateTime = new Date(dateTime);
	},
	changeFinishDateTime(dateTime){
		_eventEdit.base.finishDateTime = new Date(dateTime);
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

const requests = {
	changeIsDateRequestBeforeBegin(checked){
		_eventEdit.requests.isDateRequestBeforeBegin = checked;
	},
	changeRequestBeginDate(date){
		_eventEdit.requests.requestBeginDate = new Date(date);
	},
	changeRequestOverDate(date){
		_eventEdit.requests.requestOverDate = new Date(date);;
	},
	changeIsAutomaticIncludeInCollaborators(checked){
		_eventEdit.requests.isAutomaticIncludeInCollaborators = checked;
	},
	changeIsApproveByBoss(checked){
		_eventEdit.requests.isApproveByBoss = checked;
	},
	changeIsApproveByTutor(checked){
		_eventEdit.requests.isApproveByTutor = checked;
	},
	sortTable(key, isAsc){
		let requestItems = _eventEdit.requests.requestItems;
		let isAscending = isAsc ? 1 : -1;
		requestItems.sort((first, second) => {
			return first[key] > second[key] ? isAscending : first[key] === second[key] ? 0 : -(isAscending);
		});
	},
	changeRequestStatus(id, status){
		let requestItems = _eventEdit.requests.requestItems;
		let item = find(requestItems, (item) => {
			return item.id === id;
		});
		if (item){
			item.status = status;
		}
	}
}

const collaborators = {
	toggleIsAssist(id, isAssist){
		let _collaborators = _eventEdit.collaborators.collaborators;
		let item = find(_collaborators, (item) => {
			return item.id === id;
		});
		if (item){
			item.isAssist = isAssist;
		}
	},
	sortTable(key, isAsc){
		let _collaborators = _eventEdit.collaborators.collaborators;
		let isAscending = isAsc ? 1 : -1;
		_collaborators.sort((first, second) => {
			return first[key] > second[key] ? isAscending : first[key] === second[key] ? 0 : -(isAscending);
		});
	},
	toggleCheckedAll(checked){
		let _collaborators = _eventEdit.collaborators.collaborators;
		_collaborators.forEach(col => {
			col.checked = checked;
		});
		_eventEdit.collaborators.checkedAll = checked;
	},
	toggleChecked(id, checked) {
		let _collaborators = _eventEdit.collaborators.collaborators;
		let item = find(_collaborators, (item) => {
			return item.id === id;
		});
		if (item){
			item.checked = checked;
		}
		if (checked){
			_eventEdit.collaborators.checkedAll = checked;
		}
		else {
			let isEveryCheked = every(_collaborators, (col) => {
				return col.checked === false;
			});
			if (isEveryCheked){
				_eventEdit.collaborators.checkedAll = false;
			}
		}
	},
	removeItems(){
		let _collaborators = _eventEdit.collaborators.collaborators;
		_collaborators = filter(_collaborators, (col) => {
			return !col.checked;
		});
		_eventEdit.collaborators.collaborators = _collaborators;
	},
	updateItems(items){
		_eventEdit.collaborators.collaborators = items.map((item) => {
			return {
				id: item.id,
				fullname: item.data.fullname,
				subdivision: item.data.subdivision,
				position: item.data.position,
				isAssist: item.data.isAssist
			}
		});
		console.log(_eventEdit.collaborators.collaborators);
	},
	changeInfoMessage(message, status){
		_eventEdit.collaborators.infoMessage = message;
		_eventEdit.collaborators.infoStatus = status;
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

		//BASE
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_NAME:
			base.changeName(action.name);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_TYPE:
			base.changeType(action.type);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_CODE:
			base.changeCode(action.code);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_START_DATETIME:
			base.changeStartDateTime(action.dateTime);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_FINISH_DATETIME:
			base.changeFinishDateTime(action.dateTime);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_ORG:
			base.changeEducationOrg(action.educationOrgId);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_METHOD:
			base.changeEducationMethod(action.educationMethod);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_BASE_CHANGE_PLACE:
			base.changePlace(action.place);
			isEmit = true;
			break;

		//REQUESTS
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_DATE_REQUEST_BEFORE_BEGIN:
			requests.changeIsDateRequestBeforeBegin(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_BEGIN_DATE:
			requests.changeRequestBeginDate(action.date);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_OVER_DATE:
			requests.changeRequestOverDate(action.date);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_AUTOMATIC_INCLUDE:
			requests.changeIsAutomaticIncludeInCollaborators(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_BOSS:
			requests.changeIsApproveByBoss(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_TUTOR:
			requests.changeIsApproveByTutor(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_SORT_TABLE:
			requests.sortTable(action.key, action.isAsc);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_STATUS:
			requests.changeRequestStatus(action.id, action.status);
			isEmit = true;
			break;

		//COLLABORATORS
		case EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_IS_ASSIST:
			collaborators.toggleIsAssist(action.id, action.isAssist);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_SORT_TABLE:
			collaborators.sortTable(action.key, action.isAsc);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_ALL:
			collaborators.toggleCheckedAll(action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED:
			collaborators.toggleChecked(action.id, action.checked);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_REMOVE_ITEMS:
			collaborators.removeItems();
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE:
			collaborators.changeInfoMessage(action.infoMesage, action.infoStatus);
			isEmit = true;
			break;
		case EventEditConstants.EVENTEDIT_COLLABORATORS_UPDATE_ITEMS:
			collaborators.updateItems(action.items);
			isEmit = true;
			break;
		default:
			return true;
	}

	if (isEmit) EventEditStore.emitChange();
	return true;
});
export default EventEditStore;
