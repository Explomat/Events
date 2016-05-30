import React from 'react';

class Auth extends React.Component {

	static propTypes = {
		componentsDenied: React.PropTypes.array,
		children: React.PropTypes.element
	}

	static defaultProps = {
		componentsDenied: []
	}

	_isDenied(name){
		var componentsDenied = this.props.componentsDenied;
		return componentsDenied.indexOf(name) !== -1;
	}

	render() {
		var children = this.props.children;
		if (!Array.isArray(children)) {
			return this._isDenied(children.type.name || children.type.displayName) ? null : children;
		}
		return null; 
	}
};

export default Auth;