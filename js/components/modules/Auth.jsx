var React = require('react');

var Auth = {

	propTypes: {
		componentsDenied: React.PropTypes.array.isRequired,
		children: React.PropTypes.element.isRequired
	},

	_isDenied: function(name){
		var componentsDenied = this.props.componentsDenied;
		return (name in componentsDenied);
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