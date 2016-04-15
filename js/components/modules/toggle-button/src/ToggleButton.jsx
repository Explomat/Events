import React from 'react';
import cx from 'classnames';
import './style/toggle-button.scss';

class ToggleButton extends React.Component {

	static propsTypes = {
		id: React.PropTypes.oneOfType([React.PropTypes.string.isRequired, React.PropTypes.number.isRequired]),
		checked: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		className: React.PropTypes.string
	}

	static defaultProps = {
		checked: false
	}

	handleToggle(){
		if (this.props.onChange){
			this.props.onChange(!this.props.checked);
		}
	}

	render() {
		const {id, checked} = this.props;
		const classes = cx("toggle-button", this.props.className);
		return (
			<div className={classes}>
				<input onChange={::this.handleToggle} type="checkbox" className="toggle-button__input" id={id} checked={checked}/>
				<label className="toggle-button__checkbox" htmlFor={id}></label>
			</div>
		);
	}
};

export default ToggleButton;