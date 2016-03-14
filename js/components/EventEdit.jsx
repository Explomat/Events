import React from 'react';
import Hasher from '../utils/Hasher';
import EventEditStore from '../stores/EventEditStore';
import CheckBox from './modules/checkbox';
import InputCalendar from './modules/input-calendar';
import SelectItems from './modules/select-items';
import moment from 'moment';
import Config from '../config';
import {merge} from 'lodash';
moment.locale('ru');


function getEventEditState() {
	return EventEditStore.getData();
}

class SideBar extends React.Component {
	
	constructor(props){
		super(props);
		this.handleSelectTab = this.handleSelectTab.bind(this);
	} 

	handleSelectTab(e){
		var target = e.target;
		if (this.props.onSelect) {
			this.props.onSelect({ key: target.getAttribute('data-name'), value: target.innerText });
		}
	}

	render(){
		return (
			<aside className="side-mnu">
				<div className="side-mnu__header">
					<i className="fa fa-angle-left backward-icon"></i>
					<span className="header-txt">Редактирование</span>
				</div>
				<div className="side-mnu__body">
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Base" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Base">Основные</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Requests" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Requests">Заявки</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Collaborators" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Collaborators">Участники</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Tutors" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Tutors">Ответственные</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Testing" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Testing">Тестирование</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Courses" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Courses">Электронные курсы</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "LibraryMaterials" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="LibraryMaterials">Материалы библиотеки</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Files" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Files">Файлы</label>
				</div>
			</aside>
		);
	}
};

class Base extends React.Component {

	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	state = {
		startDate: moment()
	}

	handleSave(){

	}

	handleChange(date) {
		this.setState({startDate: date});
	}

	render(){
		return (
			<InputCalendar 
				moment={this.state.startDate} 
				onChange={this.handleChange} 
				onSave={this.handleSave} 
				prevMonthIcon={'fa fa-angle-left'}
				nextMonthIcon={'fa fa-angle-right'}/>
		);
	}
};

class Requests extends React.Component {

	render(){
		return (
			<div>
				<CheckBox label={"Автоматически включать в состав участников"} />
				<CheckBox label={"Необходимо подтверждение от непосредственного руководителя"} />
				<CheckBox label={"Необходимо подтверждение от ответственного за мероприятие"} />
			</div>
		);
	}
};

class Collaborators extends React.Component {
	render(){
		return (
			<div>Collaborators</div>
		);
	}
};

class Tutors extends React.Component{
	render(){
		return (
			<div>Tutors</div>
		);
	}
};

class Testing extends React.Component{
	render(){
		return (
			<div>Testing</div>
		);
	}
};

class Courses extends React.Component{
	render(){
		return (
			<div>Courses</div>
		);
	}
};

class LibraryMaterials extends React.Component{
	render(){
		return (
			<div>LibraryMaterials</div>
		);
	}
};

class Files extends React.Component{
	render(){
		return (
			<div>Files</div>
		);
	}
};

class EventEdit extends React.Component{

	constructor(props){
		super(props);
		this.sideBarComponents = {'Base': Base, 'Requests': Requests, 'Collaborators': Collaborators, 'Tutors': Tutors, 'Testing': Testing, 'Courses': Courses, 'LibraryMaterials': LibraryMaterials, 'Files': Files};
		this._onChange = this._onChange.bind(this);
		this.getTabView = this.getTabView.bind(this);
		this.getModal = this.getModal.bind(this);
		this.handleSelectTab = this.handleSelectTab.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleSaveItems = this.handleSaveItems.bind(this);
	}

	state =  merge(getEventEditState(), {
		selectedTab: { key: 'Base', value: 'Основные' },
		isShowModal: false
	})

	componentDidMount() {
		EventEditStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		EventEditStore.removeChangeListener(this._onChange);
	}

	_onChange() {
		this.setState(getEventEditState());
	}

	getTabView(tabName){
		var Component = this.sideBarComponents[tabName];
		return Component ? <Component /> : null;
	}

	getModal(){
		return this.state.isShowModal ? <SelectItems
											title={"Test"}
											query={Config.url.createPath({action_name: 'getCollaborators'})}
											onClose={this.handleCloseModal} 
											onSave={this.handleSaveItems}/> : null;
	}

	handleSelectTab(tabName){
		this.setState({selectedTab: tabName})
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleShowModal(){
		this.setState({isShowModal: true});
	}

	handleSaveItems(items){
		this.setState({isShowModal: false});
	}

	render(){
		var tabView = this.getTabView(this.state.selectedTab.key);
		var modal = this.getModal();
		return(
			<div className="container">
				<SideBar onSelect={this.handleSelectTab} selectedTab={this.state.selectedTab.key}/>
				<div className="calendar">
					<header className ="calendar-header">
						<span>{this.state.selectedTab.value}</span>
					</header>
					{tabView}
					{modal}
					<button onClick={this.handleShowModal}>Open modal</button>
				</div>
			</div>
		);
	}
};

export default EventEdit;