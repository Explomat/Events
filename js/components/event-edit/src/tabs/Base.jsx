import React from 'react';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import InputCalendar from 'components/modules/input-calendar';
import SelectOneItem from 'components/modules/select-one-item';
import SelectTree from 'components/modules/select-tree';

import Config from 'config';
import moment from 'moment';
moment.locale('ru');

import '../style/event-edit-base.scss';

class Base extends React.Component {

	constructor(props){
		super(props);
		this.handleChangeDate = this.handleChangeDate.bind(this);
		this.handleSaveItems = this.handleSaveItems.bind(this);
		this.handleChangeEventType = this.handleChangeEventType.bind(this);
		this.handleChangeOrg = this.handleChangeOrg.bind(this);
		this.handleChangeEducation = this.handleChangeEducation.bind(this);
		this.handleSavePlace = this.handleSavePlace.bind(this);
	}

	static defaultProps = {
		places: {nodes:[]}
	}

	handleChangeDate(/*date*/) {
		
	}

	handleSaveItems(/*items*/){
		this.setState({isShowModal: false});
	}

	handleChangeEventType(){

	}

	handleChangeOrg(/*item*/) {
		
	}

	handleChangeEducation(/*item*/){
		
	}

	handleSavePlace(item){
		console.log(item);
	}

	render(){
		return (
			<div className="event-edit-base">
				<TextView value={this.props.name} placeholder={"Название"} className="event-edit-base__name"/>
				<DropDown 
					description={"Тип мероприятия"}
					onChange={this.handleChangeEventType} 
					items={this.props.types} 
					selectedPayload={this.props.selectedType}/>
				<DropDown 
					description={"Код мероприятия"}
					onChange={this.handleChangeEventType} 
					items={this.props.codes} 
					selectedPayload={this.props.selectedCode}/>
				<div className="event-edit-base__date-time">
					<i className="fa fa-clock-o icon-clock"></i>
					<div className="date">
						<InputCalendar 
							moment={moment(this.props.startDateTime)} 
							onChange={this.handleChangeDate} 
							prevMonthIcon={'fa fa-angle-left'}
							nextMonthIcon={'fa fa-angle-right'}/>
						<InputCalendar 
							moment={moment(this.props.finishDateTime)} 
							onChange={this.handleChangeDate} 
							prevMonthIcon={'fa fa-angle-left'}
							nextMonthIcon={'fa fa-angle-right'}/>
					</div>
				</div>
				<DropDown 
					description={"Обучающая организация"}
					onChange={this.handleChangeEventType} 
					items={this.props.educationOrgs} 
					selectedPayload={this.props.selectedEducationOrgId}/>
				<SelectOneItem
					selectedItem={this.props.selectedEducationMethod} 
					placeholder={"Учебная программа"} 
					modalTitle={"Учебная программа"} 
					query={Config.url.createPath({action_name: 'getEducationMethod'})}
					onChange={this.handleChangeEducation}/>
				<SelectTree 
					nodes={this.props.places.nodes}
					selectedNode={this.props.places.selectedNode} 
					placeholder={"Выберите расположение"} 
					onSave={this.handleSavePlace}
					isExpand={true}/>
			</div>
		);
	}
};

export default Base;