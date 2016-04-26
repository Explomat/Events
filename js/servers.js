var servers = [];

function Server(_id){
	var id = _id;
	var actions = [];

	this.addActions = function(_actions){
		_actions = _actions || [];
		actions = actions.concat(_actions);
		return this;
	}

	this.getId = function(){
		return id;
	}

	this.getActions = function(){
		return actions;
	}
}

module.exports = {
	addServer: function(id){
		var server = new Server(id);
		servers.push(server);
		return server;
	},

	getAll: function(){
		return servers;
	}
}