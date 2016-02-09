var React = require('react');
var Hasher = require('../utils/Hasher');
var EventEditStore = require('../stores/EventEditStore');

function getEventInfoState() {
	return EventEditStore.getData();
}

var SideBar = React.createClass({
	<aside className="side-mnu">
		<div className="side-mnu__header">
			<i className="fa fa-angle-left backward-icon"></i>
			<span className="header-txt">Редактирование</span>
		</div>
		<label className="side-mnu__tab-label">Основные</label>
		<label className="side-mnu__tab-label">Заявки</label>
		<label className="side-mnu__tab-label">Участники</label>
		<label className="side-mnu__tab-label">Ответственные</label>
		<label className="side-mnu__tab-label">Тестирование</label>
		<label className="side-mnu__tab-label">Электронные курсы</label>
		<label className="side-mnu__tab-label">Материалы библиотеки</label>
		<label className="side-mnu__tab-label">Файлы</label>

	</aside>
});

var EventEdit = React.createClass({

	displayName: 'EventEdit',

	componentDidMount: function() {
		EventInfoStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		EventInfoStore.removeChangeListener(this._onChange);
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
												<input type="checkbox" id="togg_check" className="toggle" value="off">
												<label for="togg_check" className="toggle__checkbox"></label>
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