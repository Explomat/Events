var React = require('react');
var Hasher = require('../utils/Hasher');
var EventEditStore = require('../stores/EventEditStore');

function getEventInfoState() {
	return EventEditStore.getData();
}

var SideBar = React.createClass({

	handleSelectTab: function(){

	},

	render: function(){
		return (
			<aside className="side-mnu">
				<div className="side-mnu__header">
					<i className="fa fa-angle-left backward-icon"></i>
					<span className="header-txt">Редактирование</span>
				</div>
				<div className="side-mnu__body">
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Основные</label>
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Заявки</label>
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Участники</label>
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Ответственные</label>
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Тестирование</label>
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Электронные курсы</label>
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Материалы библиотеки</label>
					<label className="side-mnu__tab-label" onClick={this.handleSelectTab}>Файлы</label>
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
			<div>Requests</div>
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

	displayName: 'EventEdit',

	componentDidMount: function() {
		EventEditStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		EventEditStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getEventInfoState());
	},

	getInitialState: function () {
		return getEventInfoState();
	},

	render: function(){
		
		return(
			<div className="container">
				<SideBar />
				<main className="calendar main-window">
					<header className="calendar-header"><span>Основные</span></header>
					<div className="render-here clearfix">
						<section id="side-mnu__tab-collaborators" className="side-mnu__tab-collaborators side-mnu__tab-item">
							<div className="side-mnu__tab-collaborators-buttons">
								<button className="event-btn event-btn--big">Удалить</button>
								<button className="event-btn event-btn--big">Отправить уведомление</button>
								<button className="event-btn event-btn--big">Добавить нового участника</button>
							</div>
							<div className="edit-event-table-wrapper edit-event-table-wrapper--header">
								<div className="edit-event-table__header-row">
									<div className="edit-event-table__cell edit-event-table__cell--name">ФИО</div>
									<div className="edit-event-table__cell edit-event-table__cell--position">Должность</div>
									<div className="edit-event-table__cell edit-event-table__cell--subdivision">Подразделение</div>
									<div className="edit-event-table__cell edit-event-table__cell--toggle">Присутствие</div>
								</div>
							</div>
							<div className="edit-event-table">
								<div className="edit-event-table-wrapper edit-event-table-wrapper--body">
									<div className="edit-event-table__header-row">
										<div className="edit-event-table__cell edit-event-table__cell--name">ФИО</div>
										<div className="edit-event-table__cell edit-event-table__cell--position">Должность</div>
										<div className="edit-event-table__cell edit-event-table__cell--subdivision">Подразделение</div>
										<div className="edit-event-table__cell edit-event-table__cell--toggle">Присутствие</div>
									</div>

									<div className="edit-event-table__row">
										<div className="edit-event-table__cell">Иванов Иван Иванович</div>
										<div className="edit-event-table__cell">продавец-консультант</div>
										<div className="edit-event-table__cell">Ситилинк имени Столыпина в Мухосранске</div>
										<div className="edit-event-table__cell">
											<div className="toggle-btn">
												<input type="checkbox" id="togg_check" className="toggle" value="off"/>
												<label className="toggle__checkbox"></label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
					<button className="event-btn event-btn--long save-btn">Сохранить</button>
				</main>
			</div>
		);
	}
});

module.exports = EventEdit;