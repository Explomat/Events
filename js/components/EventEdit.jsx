var React = require('react');
var Hasher = require('../utils/Hasher');
var EventEditStore = require('../stores/EventEditStore');
var CheckBox = require('./modules/checkbox');
var InputCalendar = require('./modules/input-calendar');
var SelectItems = require('./modules/select-items');
var moment = require('moment');
var Config = require('../config');
moment.locale('ru');


function getEventEditState() {
	return EventEditStore.getData();
}

var SideBar = React.createClass({

	handleSelectTab: function(e){
		var target = e.target;
		if (this.props.onSelect) {
			this.props.onSelect({ key: target.getAttribute('data-name'), value: target.text });
		}
	},

	render: function(){
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
});

var Base = React.createClass({
	
	handleChange: function(e){
		console.log(e);
	},

	getInitialState: function() {
	    return {
	      startDate: moment()
		};
	},

	handleChange: function(date) {
		this.setState({startDate: date});
	},

	render: function(){
		return (
			<InputCalendar 
				moment={this.state.startDate} 
				onChange={this.handleChange} 
				onSave={this.handleSave} 
				prevMonthIcon={'fa fa-angle-left'}
				nextMonthIcon={'fa fa-angle-right'}
			/>
		);
	}
});

var Requests = React.createClass({
	render: function(){
		return (
			<div>
				<CheckBox label={"Автоматически включать в состав участников"} />
				<CheckBox label={"Необходимо подтверждение от непосредственного руководителя"} />
				<CheckBox label={"Необходимо подтверждение от ответственного за мероприятие"} />
			</div>
		);
	}
});

var Collaborators = React.createClass({
	render: function(){
		return (
			<div>Collaborators</div>
		);
	}
});

var Tutors = React.createClass({
	render: function(){
		return (
			<div>Tutors</div>
		);
	}
});

var Testing = React.createClass({
	render: function(){
		return (
			<div>Testing</div>
		);
	}
});

var Courses = React.createClass({
	render: function(){
		return (
			<div>Courses</div>
		);
	}
});

var LibraryMaterials = React.createClass({
	render: function(){
		return (
			<div>LibraryMaterials</div>
		);
	}
});

var Files = React.createClass({
	render: function(){
		return (
			<div>Files</div>
		);
	}
});

var EventEdit = React.createClass({

	componentWillMount: function(){
		this.sideBarComponents = {'Base': Base, 'Requests': Requests, 'Collaborators': Collaborators, 'Tutors': Tutors, 'Testing': Testing, 'Courses': Courses, 'LibraryMaterials': LibraryMaterials, 'Files': Files};
	},

	componentDidMount: function() {
		EventEditStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		EventEditStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getEventEditState());
	},

	getInitialState: function () {
		var state = getEventEditState();
		state.selectedTab = { key: 'Base', value: 'Основные' };
		state.isShowModal = false;
		return state;
	},

	getTabView: function(tabName){
		var Component = this.sideBarComponents[tabName];
		return Component ? <Component /> : null;
	},

	getModal: function(){
		return this.state.isShowModal ? <SelectItems
											query={'http://study.merlion.ru/custom_web_template.html?object_id=6238833803725312131&server_id=6257108030223689633&action_name=getCollaborators'}
											title={"Выберите участников"} 
											onClose={this.handleCloseModal} 
											onSave={this.handleSaveItems}/> : null;
	},

	handleSelectTab: function(tabName){
		this.setState({selectedTab: tabName})
	},

	handleCloseModal: function(){
		this.setState({isShowModal: false});
	},

	handleShowModal: function(){
		this.setState({isShowModal: true});
	},

	handleSaveItems: function(items){
		this.setState({isShowModal: false});
	},

	render: function(){
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
});

module.exports = EventEdit;