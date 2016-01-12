var React = require('react');

var Auth = {

	propTypes: {
		componentsDenied: React.PropTypes.array.isRequired,
		children: React.PropTypes.element.isRequired
	},

	_isDenied: function(name){
		var componentsDenied = this.props.componentsDenied;
		for (var i = componentsDenied.length - 1; i >= 0; i--) {
			if (componentsDenied[i] === name) return true;
		};
		return false;
	},

	render: function() {
		var children = this.props.children;
		return (
			{children.map(function(child){
				return this._isDenied(child.displayName) ? null : child;
			}.bind(this))}
		);
	}
};

module.exports = Auth;