import React from 'react';
import DropDown from '../modules/dropdown';

class RegionsFilter extends React.Component {

	handleChangeRegion(e, payload, text, index) {
		if (this.props.onChange) {
			this.props.onChange(e, payload, text, index);
		}
	}

	render() {
		return (
			<DropDown onChange={::this.handleChangeRegion} items={this.props.items} selectedPayload={this.props.selectedPayload} deviders={[1]} className={"calendar-header__regions"} classNameButton={"calendar-header__regions-button"}/>
		);
	}
};
export default RegionsFilter;
