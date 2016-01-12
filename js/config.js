var serverId = '6230716351040721570';
var routerId = '6238833803725312131';
var customBaseUrl = '/custom_web_template.html';

module.exports = {

	url: {
		defaultPath: customBaseUrl.concat('?object_id=').concat(routerId).concat('&server_id='.concat(serverId)),
		createPath: function(obj){
			return this.defaultPath.concat(Object.keys(obj).map(function(k){
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
		eventView: 'event/view/{id}'
	},

	setServerId: function(_serverId){
		serverId = _serverId;
	},

	setRouterId: function(_routerId){
		routerId = _routerId;
	},

	setCustomBaseUrl: function(_customBaseUrl){
		customBaseUrl = _customBaseUrl;
	},

	setProductionMode: function () {
		process.env.NODE_ENV = 'production'
	}
}