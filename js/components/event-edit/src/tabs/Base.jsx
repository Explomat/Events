import React from 'react';
import TextLabel from '../../../modules/text-label';
import DropDown from '../../../modules/dropdown';
import InputCalendar from '../../../modules/input-calendar';
import SelectItems from '../../../modules/select-items';
import moment from 'moment';
moment.locale('ru');

class Base extends React.Component {

	constructor(props){
		super(props);
		this.handleChangeDate = this.handleChangeDate.bind(this);
	}

	state = {
		startDate: moment()
	}

	handleChangeDate(date) {
		this.setState({startDate: date});
	}

	getModal(){
		return this.state.isShowModal ? <SelectItems
											title={"Обучающая организация"}
											maxSelectedItems={1}
											query={Config.url.createPath({action_name: 'getCollaborators'})}
											onClose={this.handleCloseModal} 
											onSave={this.handleSaveItems}/> : null;
	}

	render(){
		return (
			<InputCalendar 
				moment={this.state.startDate} 
				onChange={this.handleChangeDate} 
				prevMonthIcon={'fa fa-angle-left'}
				nextMonthIcon={'fa fa-angle-right'}/>
		);
	}
};

export default Base;