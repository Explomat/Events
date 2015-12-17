var serverId = '6166852566696923932';
var routerUrl = '/custom_web_template.html?object_id=6135330846971222087';

module.exports = {

	url: {
		defaultPath: routerUrl.concat('&server_id='.concat(serverId)),
		createPath: function(obj){
			return this.defaultPath.concat(Object.keys(obj).map(function(k){
				return '&'.concat(k).concat('=').concat(obj[k]);
			}).join(''));
		}
	},

	icons: {
		loading: 'build/icons/loading.gif'
	},

	dom: {
		basicAppId: 'basicApp',
		appId: 'app',
		modalId: 'modal'
	},

	setServerId: function(serverId){
		serverId = serverId;
	},

	setProductionMode: function () {
		process.env.NODE_ENV = 'production'
	}
}