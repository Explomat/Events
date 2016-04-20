import React from 'react';
import DropDown from '../modules/dropdown';

class BusinessTypeFilter extends React.Component {

	handleChangeBusinessType(e, payload, text, index) {
		if (this.props.onChange) {
			this.props.onChange(e, payload, text, index);
		}
	}

	render() {
		return (
			<DropDown onChange={::this.handleChangeBusinessType} items={this.props.items} selectedPayload={this.props.selectedPayload} deviders={[1]} className={"calendar-header__business-type"} classNameButton={"calendar-header__business-type-button"}/>
		);
	}
};
export default BusinessTypeFilter;