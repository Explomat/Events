var routerId = '6238833803725312131';
var customBaseUrl = 'http://study.merlion.ru/custom_web_template.html';

var servers = [
	{
		id: '6230716351040721570',
		actions: [
			'getData',
			'getEventsData',
			'getEventInfo',
			'createRequest',
			'removeCollaborator',
			'startEvent',
			'finishEvent'
		]
	},
	{
		id: '6257108030223689633',
		actions: [
			'getEventEditData',
			'getCollaborators',
			'getLectors',
			'getTests',
			'getEducationMethod',
			'createNotification',
			'processingRequest'
		]
	}
]

module.exports = {

	url: {
		getServerId(_action) {
			var _servers = servers.filter(s => {
				var actions = s.actions.filter(action => {
					return action === _action;
				});
				return actions.length > 0;
			}).map(s => { return s.id; });
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

	img: {
		eventNotFound: '/react/events/build/icons/event_not_found.png'
	},

	hashes: {
		calendar: 'calendar',
		eventView: 'event/view/{id}',
		eventEdit: 'event/edit/{id}'
	},

	setRouterId(_routerId){
		routerId = _routerId;
	},

	setCustomBaseUrl(_customBaseUrl){
		customBaseUrl = _customBaseUrl;
	},

	setProductionMode() {
		process.env.NODE_ENV = 'production';
	}
}