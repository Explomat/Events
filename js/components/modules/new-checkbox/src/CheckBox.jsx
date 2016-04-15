import React from 'react';
import cx from 'classnames';
import './style/checkbox.scss';

class CheckBox extends React.Component {

	static propsTypes = {
		checked: React.PropTypes.bool,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func,
		className: React.PropTypes.string
	}

	handleToggleChecked(e){
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();
    	
		if (this.props.onChange){
			this.props.onChange(!this.props.checked);
		}
	}

	render() {
		const classes= cx({
			'checkbox-box': true
		}, this.props.className);

		const checkboxIconClasses = cx({
			'checkbox-box__icon': true,
			'checkbox-box__icon--checked': this.props.checked
		});
		return (
			<div className={classes} onClick={::this.handleToggleChecked}>
				<div className="checkbox-box__container">
					<div className={checkboxIconClasses}></div>
					<div className="checkbox-box__label">{this.props.label}</div>
				</div>
			</div>
		);
	}
};

export default CheckBox;