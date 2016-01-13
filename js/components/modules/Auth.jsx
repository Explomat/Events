var React = require('react');

var Auth = React.createClass({

	propTypes: {
		componentsDenied: React.PropTypes.array.isRequired,
		children: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.array]).isRequired
	},

	_isDenied: function(name){
		var componentsDenied = this.props.componentsDenied;
		return componentsDenied.indexOf(name) !== -1;
	},

	render: function() {
		var children = this.props.children;
		if (!Array.isArray(children)) {
			if (this._isDenied(children.type.displayName)) return null;
			return children;
		} 
		return (
			children.map(function(child){
				return this._isDenied(child.type.displayName) ? null : child;
			}.bind(this))
		);
	}
});

module.exports = Auth;