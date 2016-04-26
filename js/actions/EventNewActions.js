import AppDispatcher from '../dispatcher/AppDispatcher';
import EventNewConstants from '../constants/EventNewConstants';
import EventNewAPI from '../api/EventNewAPI';

module.exports = {

	setDefaultData(){
		AppDispatcher.handleAction({
			actionType: EventNewConstants.EVENT_NEW_SET_DEFAULT_DATA
		});
	},

	getCollaborators(filterText){
		EventNewAPI.getCollaborators(filterText).then((collaborators) => {
			AppDispatcher.handleAction({
				actionType: EventNewConstants.EVENT_NEW_GET_COLLABORATORS,
				collaborators: collaborators
			});
		});
	}
}