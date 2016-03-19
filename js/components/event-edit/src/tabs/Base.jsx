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

var places = {
	items: [
		{
			"id": 1,
			"name": "All Categories",
			"selected": false,
			"descr": null,
			"children": [
				{
				  "id": 2,
				  "name": "For Sale",
				  "selected": false,
				  "descr": { "id":"d_1", "name":"Москва" },
				  "children": [
				    {
				      "id": 4,
				      "name": "Baby & Kids Stuff",
				      "selected": true,
				      "descr": null
				    },
				    {
				      "id": 5,
				      "name": "Music, Films, Books & Games",
				      "selected": false,
				      "descr": { "id":"d_4", "name":"Ярославль" }
				    }
				  ]
				},
			    {
			      "id": 6,
			      "name": "Motors",
			      "selected": false,
			      "descr": { "id":"d_5", "name":"Москва" },
			      "children": [
			        {
			          "id": 7,
			          "name": "Car Parts & Accessories",
			          "selected": false,
			          "descr": { "id":"d_6", "name":"Красноярск" }
			        },
			        {
			          "id": 8,
			          "name": "Cars",
			          "selected": false,
			          "descr": { "id":"d_7", "name":"Москва" }
			        },
			        {
			          "id": 10016,
			          "name": "Motorbike Parts & Accessories",
			          "selected": false,
			          "descr": { "id":"d_8", "name":"Москва" }
			        }
			      ]
			    },
			    {
			      "id": 9,
			      "name": "Jobs",
			      "selected": false,
			      "descr": { "id":"d_9", "name":"Красноярск" },
			      "children": [
			        {
			          "id": 10,
			          "name": "Accountancy",
			          "selected": false,
			          "descr": { "id":"d_10", "name":"Москва" }
			        },
			        {
			          "id": 11,
			          "name": "Financial Services & Insurance",
			          "selected": false,
			          "descr": { "id":"d_11", "name":"Ставрополь" }
			        },
			        {
			          "id": 12,
			          "name": "Bar Staff & Management",
			          "selected": false,
			          "descr": { "id":"d_12", "name":"Самара" }
			        }
			      ]
			    }
			]
		}
	]
}

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

	state = {
		startDate: moment(),
		selectedItemOrg: null,
		selectedItemEducation: null
	}

	handleChangeDate(date) {
		this.setState({startDate: date});
	}

	handleSaveItems(items){
		this.setState({isShowModal: false});
	}

	handleChangeEventType(){

	}

	handleChangeOrg(item) {
		this.setState({selectedItemOrg: item});
	}

	handleChangeEducation(item){
		this.setState({selectedItemEducation: item});
	}

	handleSavePlace(item){
		console.log(item);
	}

	render(){
		return (
			<div className="event-edit-base">
				<TextView value={this.props.value} placeholder={"Название"} className="event-edit-base__name"/>
				<DropDown 
					description={"Тип мероприятия"}
					onChange={this.handleChangeEventType} 
					items={this.props.eventTypes} 
					selectedPayload={this.props.selectedEventType}/>
				<DropDown 
					description={"Код мероприятия"}
					onChange={this.handleChangeEventType} 
					items={this.props.eventTypes} 
					selectedPayload={this.props.selectedEventType}/>
				<div className="event-edit-base__date-time">
					<i className="fa fa-clock-o icon-clock"></i>
					<div className="date">
						<InputCalendar 
							moment={this.state.startDate} 
							onChange={this.handleChangeDate} 
							prevMonthIcon={'fa fa-angle-left'}
							nextMonthIcon={'fa fa-angle-right'}/>
						<InputCalendar 
							moment={this.state.startDate} 
							onChange={this.handleChangeDate} 
							prevMonthIcon={'fa fa-angle-left'}
							nextMonthIcon={'fa fa-angle-right'}/>
					</div>
				</div>
				<SelectOneItem
					selectedItem={this.state.selectedItemOrg} 
					placeholder={"Обучающая организация"} 
					modalTitle={"Обучающая организация"} 
					query={Config.url.createPath({action_name: 'getCollaborators'})}
					onChange={this.handleChangeOrg}/>
				<SelectOneItem
					selectedItem={this.state.selectedItemEducation} 
					placeholder={"Учебная программа"} 
					modalTitle={"Учебная программа"} 
					query={Config.url.createPath({action_name: 'getCollaborators'})}
					onChange={this.handleChangeEducation}/>
				<SelectTree 
					items={places.items} 
					placeholder={"Выберите расположение"} 
					onSave={this.handleSavePlace}
					isExpand={true}/>
			</div>
		);
	}
};

export default Base;