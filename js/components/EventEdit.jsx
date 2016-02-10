var React = require('react');
var Hasher = require('../utils/Hasher');
var EventEditStore = require('../stores/EventEditStore');
var CheckBox = require('./modules/CheckBox');

function getEventEditState() {
	return EventEditStore.getData();
}

var SideBar = React.createClass({

	handleSelectTab: function(e){
		var target = e.target;
		if (this.props.onSelect) 
			this.props.onSelect(target.getAttribute('data-name'));
	},

	render: function(){
		return (
			<aside className="side-mnu">
				<div className="side-mnu__header">
					<i className="fa fa-angle-left backward-icon"></i>
					<span className="header-txt">Редактирование</span>
				</div>
				<div className="side-mnu__body">
					<label className={"side-mnu__tab-label " + this.props.selectedTab === "Base" ? "side-mnu__tab-label--selected": "" } onClick={this.handleSelectTab} data-name="Base">Основные</label>
					<label className={"side-mnu__tab-label "} onClick={this.handleSelectTab} data-name="Requests">Заявки</label>
					<label className={"side-mnu__tab-label "} onClick={this.handleSelectTab} data-name="Members">Участники</label>
					<label className={"side-mnu__tab-label "} onClick={this.handleSelectTab} data-name="Tutors">Ответственные</label>
					<label className={"side-mnu__tab-label "} onClick={this.handleSelectTab} data-name="Testing">Тестирование</label>
					<label className={"side-mnu__tab-label "} onClick={this.handleSelectTab} data-name="Courses">Электронные курсы</label>
					<label className={"side-mnu__tab-label "} onClick={this.handleSelectTab} data-name="LibraryMaterials">Материалы библиотеки</label>
					<label className={"side-mnu__tab-label "} onClick={this.handleSelectTab} data-name="Files">Файлы</label>
				</div>
			</aside>
		);
	}
});

var Base = React.createClass({
	render: function(){
		return (
			<div>Base</div>
		);
	}
});

var Requests = React.createClass({
	render: function(){
		return (
			<div>
				<CheckBox label={"Автоматически включать в состав участников"} />
			</div>
		);
	}
});

var Members = React.createClass({
	render: function(){
		return (
			<div>Members</div>
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
		this.sideBarComponents = {'Base': Base, 'Requests': Requests, 'Members': Members, 'Tutors': Tutors, 'Testing': Testing, 'Courses': Courses, 'LibraryMaterials': LibraryMaterials, 'Files': Files};
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
		state.selectedTab = 'Base';
		return state;
	},

	getTabView: function(tabName){
		var Component = this.sideBarComponents[tabName];
		return Component ? <Component /> : null;
	},

	handleSelectTab: function(tabName){
		this.setState({selectedTab: tabName})
	},

	render: function(){
		var tabView = this.getTabView(this.state.selectedTab);
		return(
			<div className="container">
				<SideBar onSelect={this.handleSelectTab} selectedTab={this.state.selectedTab}/>
				<div className="calendar">
					<header className ="calendar-header">
						<span>{this.state.selectedTab}</span>
					</header>
					{tabView}
				</div>
			</div>
		);
	}
});

module.exports = EventEdit;