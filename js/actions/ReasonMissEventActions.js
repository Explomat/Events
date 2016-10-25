import AppDispatcher from '../dispatcher/AppDispatcher';
import ReasonMissEventConstants from 'constants/ReasonMissEventConstants';
import ReasonMissEventAPI from 'api/ReasonMissEventAPI';

module.exports = {

	receiveData(data){
		AppDispatcher.handleAction({
			actionType: ReasonMissEventConstants.REASON_MISS_EVENT_RECEIVE_DATA,
			data
		});
	},

	searchData(value){
		AppDispatcher.handleAction({
			actionType: ReasonMissEventConstants.REASON_MISS_EVENT_SEARCH_DATA,
			value
		});
	},

	sortData(payload){
		AppDispatcher.handleAction({
			actionType: ReasonMissEventConstants.REASON_MISS_EVENT_SORT_DATA,
			payload
		})
	},

	removeUser(event_result_id, reason_type, reason){
		AppDispatcher.handleAction({
			actionType: ReasonMissEventConstants.REASON_MISS_EVENT_REMOVE_USER
		})
		ReasonMissEventAPI.removeUser(event_result_id, reason_type, reason).then(data => {
			if (data.error){
				AppDispatcher.handleAction({
					actionType: ReasonMissEventConstants.REASON_MISS_EVENT_REMOVE_USER_FAILURE,
					error: data.error
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: ReasonMissEventConstants.REASON_MISS_EVENT_REMOVE_USER_SUCCESS,
					response: data,
					event_result_id,
					reason_type,
					reason
				})
			}
		}).catch(err => {
			AppDispatcher.handleAction({
				actionType: ReasonMissEventConstants.REASON_MISS_EVENT_REMOVE_USER_FAILURE,
				error: err
			});
		})
	}
}
