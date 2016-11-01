import React from 'react';
import cx from 'classnames';
import './style/checkbox.scss';

class CheckBox extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			checked: props.checked || false
		}
	}

	static propsTypes = {
		checked: React.PropTypes.bool,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func,
		className: React.PropTypes.string,
		style: React.PropTypes.object
	}

	componentWillReceiveProps(nextProps){
		this.setState({checked: nextProps.checked});
	}

	handleToggleChecked(e){
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();

		this.setState({checked: !this.state.checked});
		if (this.props.onChange){
			this.props.onChange(!this.state.checked);
		}
	}

	render() {
		const classes= cx({
			'checkbox-box': true, 
			'checkbox-box--empty': !this.props.label
		},this.props.className);
		return (
			<div style={this.props.style} className={classes} onClick={::this.handleToggleChecked}>
				<input className="checkbox-box__input" type="checkbox" checked={this.state.checked} onChange={function(){}}/>
    			<label className="checkbox-box__label">{this.props.label}</label>
			</div>
		);
	}
};

export default CheckBox;