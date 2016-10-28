var servers = require('./servers');
import env from './env';
var routerId = '6238833803725312131';
let customBaseUrl = env === 'production' ? '/custom_web_template.html' : 'https://study.merlion.ru/custom_web_template.html';

servers
	.addServer('6230716351040721570')
	.addActions(
		[
			'getData',
			'getEventsData',
			'getEventInfo',
			'createRequest',
			'removeCollaborator',
			'startEvent',
			'finishEvent',
			'planEvent',
			'cancelEvent',
			'isDeniedActionAccess'
		]);
servers
	.addServer('6257108030223689633')
	.addActions(
		[
			'saveData',
			'getEventEditData',
			'getCollaborators',
			'getLectors',
			'getTests',
			'getEducationMethod',
			'createNotification',
			'processingRequest',
			'uploadFile',
			'uploadLibraryMaterial',
			'removeFiles',
			'addFiles',
			'getFiles',
			'getLibraryMaterials',
			'addLibraryMaterials',
			'removeLibraryMaterials',
			'forLiveSearchGetCollaborators',
			'forLiveSearchGetLectors',
			'forLiveSearchGetEducationMethods',
			'forLiveSearchGetPlaces',
			'getDataForNewEvent',
			'createEvent',
			'changeStatus',
			'isEventEditing',
			'exportTestResultsToExcel'
		]);
servers
	.addServer('6340892634520636755')
	.addActions(
		[
			'getDataReasonMissEvent',
			'removeUser'
		]);

module.exports = {

	url: {
		getServerId(_action) {
			var _servers = servers.getAll().filter(s => {
				var actions = s.getActions().filter(action => {
					return action === _action;
				});
				return actions.length > 0;
			}).map(s => { return s.getId(); });
			return _servers.length > 0 ? _servers[0] : '';
		},

		createPath(obj){
			if (!('action_name' in obj)) obj.action_name = '';
			var serverId = this.getServerId(obj.action_name);
			var basePath = customBaseUrl.concat('?object_id=').concat(routerId).concat('&server_id='.concat(serverId));

			return basePath.concat(Object.keys(obj).map(function(k){
				return '&'.concat(k).concat('=').concat(obj[k]);
			}).join(''));
		}
	},

	dom: {
		basicAppId: 'basicApp',
		appId: 'app',
		eventViewModalId: 'eventViewModalId',
		modalId: 'modal'
	},

	hashes: {
		calendar: 'calendar',
		eventView: 'event/view/{id}',
		eventEdit: 'event/edit/{id}',
		eventNew: 'event/new',
		reasonMissEvent: 'reasonMissEvent'
	},

	setRouterId(_routerId){
		routerId = _routerId;
	},

	setCustomBaseUrl(_customBaseUrl){
		customBaseUrl = _customBaseUrl;
	}
}