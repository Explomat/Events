var React = require('react');

var Auth = React.createClass({

	propTypes: {
		componentsDenied: React.PropTypes.array,
		children: React.PropTypes.element
	},

	getDefaultProps: function(){
		return {
			componentsDenied: []
		}
	},

	_isDenied: function(name){
		var componentsDenied = this.props.componentsDenied;
		return componentsDenied.indexOf(name) !== -1;
	},

	render: function() {
		var children = this.props.children;
		if (!Array.isArray(children)) {
			return this._isDenied(children.type.displayName) ? null : children;
		}
		return null; 
	}
});

module.exports = Auth;