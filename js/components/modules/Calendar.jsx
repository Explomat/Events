var React = require('react');
var DropDown = require('./DropDown');
var DateUtils = require('../../utils/event/DateUtils');
var EventStatuses = require('../../utils/event/EventStatuses');
var CalendarActions = require('../../actions/CalendarActions');

var EventSideBar = React.createClass({

	getTime: function(){
		var startDate = this.props.startDate;
		var finishDate = this.props.finishDate;
		return startDate.getHours() + ':' + startDate.getMinutes() + '-' +  finishDate.getHours() + ':' + finishDate.getMinutes();
	},

	render: function(){
		var time = this.getTime();
		return(
			<section className="timetable__event clearfix">
				<div className="timetable__event-info-wrapper">
					<i className="timetable_info-icon fa fa-clock-o"></i>
					<p className="timetable__event-info timetable__event-info--time">{time}</p>
					<i className="timetable_info-icon fa fa-desktop"></i>
					<p className="timetable__event-info timetable__event-info--name">{this.props.name}</p>
					<i className="timetable_info-icon fa fa-map-marker"></i>
					<p className="timetable__event-info timetable__event-info--place">{this.props.place}</p>
				</div>
				<button className="timetable__event-details-btn">Подробнее</button>
			</section>
		);
	}
})

var SideBar = React.createClass({

	propsTypes: {
		events: React.PropTypes.array
	},

	getDefaultProps: function () {
		return {
			events: []
		}
	},

	getSelectedEvents: function(selectedDate, events){
		return this.props.events.filter(function(ev){
			return DateUtils.compare(selectedDate, ev.startDate);
		})
	},

	render: function() {
		var selectedDate = this.props.selectedDate.toLocaleDateString('ru', {year: 'numeric', month: 'long', day: 'numeric'});
		var selectedEvents = this.getSelectedEvents(this.props.selectedDate, this.props.events);
		var isDisplayMessage = { display: selectedEvents.length === 0 ? 'block' : 'none' }
		return (
			<aside className="timetable">
				<header className="timetable__header">
					<i className="timetable__header-icon fa fa-calendar"></i>
					<p className="timetable__header-date">{selectedDate}</p>
				</header>
				<div style={isDisplayMessage} className="timetable__message">Нет мероприятий на выбранную дату</div>
				{selectedEvents.map(function(ev, index){
					return <EventSideBar key={index} {...ev} />
				})}
			</aside>
		);
	}
});

var Filters = React.createClass({

	propsTypes: {
		selectedMonthIndex: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
	},

	handleChangeMonth: function(e, payload, text, index){
		CalendarActions.changeMonth(index);
	},

	render: function() {
		return (
			<header className="calendar-header">
				<DropDown onChange={this.handleChangeMonth} items={DateUtils.getMonths()} selectedPayload={this.props.selectedMonthIndex} className={"calendar-header__months"} classNameButton={"calendar-header__months-button"}/>
			</header>
		);
	}
})

var CalendarCell = React.createClass({
	
	propsTypes: {
		day: React.PropTypes.number,
		isCurrentDay: React.PropTypes.bool,
		events: React.PropTypes.array
	},

	getDefaultProps: function(){
		return {
			day: '',
			isCurrentDay: false,
			events: []
		}
	},

	handleClick: function(){
		if (this.props.onClick){
			this.props.onClick(this.props.date);
		}
	},

	getEventsMarkup: function () {
		return this.props.events.map(function(ev, index) {
			var classItem = "event-list__item--" + ev.status;
			return (<p key={index} className={"event-list__item " + classItem}>
						<span className="event-list__item-name">{ev.name}</span>
					</p>);
		});
	},

	render: function(){
		var cellClassName = this.props.isCurrentDay ? 'day__number--current' : '';
		var isHoverClass = !this.props.onClick && !this.props.day ? 'calendar-table__day--no-hover' : '';
		return (
			<div onClick={this.handleClick} className={"calendar-table__day " + isHoverClass}>
				<p className="day">
					<span className={"day__number " + cellClassName}>{this.props.day}</span>
				</p>
				<div className="event-list">
					{this.getEventsMarkup()}
				</div>
			</div>
		);
	}
})

var CalendarView = React.createClass({

	_getDay: function(date){
		if (!date) return -1;

		var day = date.getDay();
		if (day === 0) day = 7;
		return day - 1;
	},

	_getLastDateInMonth: function(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0);
	},

	_getEventsInDate: function(date, events){
		var _events = [];
		for (var i = events.length - 1; i >= 0; i--) {
			if (DateUtils.compare(events[i].startDate, date)) _events.push(events[i]);
		};
		return _events;
	},

	propsTypes: {
		currentDate: function(props, propName){
			if (typeof(props[propName] !== Date)) {
				return new Error('Validation for \'currentDate\' failed!');
			}
		},
		selectedDate: function(props, propName){
			if (typeof(props[propName] !== Date)) {
				return new Error('Validation for \'currentDate\' failed!');
			}
		},
		events: React.PropTypes.array
	},

	getDefaultProps: function(){
		return {
			events: []
		}
	},

	componentWillReceiveProps: function(nextProps){
		
	},

	getRows: function(){
		var rows = [];
		var currentDate = this.props.currentDate;
		var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth());
		//var lastDate = this._getLastDateInMonth(currentDate);
		var startWeekDay = this._getDay(startDate);
		//var lastWeekDay = this._getDay(lastDate);
		var currentMonth = startDate.getMonth();
		//var countDays = startWeekDay +  (6 - lastWeekDay) + lastDate.getDate();

		for (var i = 0; i < 6; i++) {
			var cells = [];
			var j = 0;
			if (i === 0){
				for (var k = 0; k < startWeekDay; k++) cells.push(<CalendarCell key={k} />);
				j = k;
			}
			for (j; j < 7; j++) {
				var isCurrentMonth = startDate.getMonth() === currentMonth;
				var curDay = isCurrentMonth ? startDate.getDate() : '';
				var events = isCurrentMonth ? this._getEventsInDate(startDate, this.props.events) : [];
				var clickFunc = isCurrentMonth ? this.handleSelectDate : undefined;
				cells.push(<CalendarCell key={j} onClick={clickFunc} day={curDay} date={new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())} isCurrentDay={currentDate.getDate() === curDay} events={events}/>);
				startDate.setDate(curDay + 1);
			};
			rows.push(<div className="calendar-table__week" key={i}>{cells}</div>);
		};
		return rows;
	},


	handleSelectDate: function(date){
		CalendarActions.selectDate(date);
	},

	render: function() {
		return (
			<div className="container">
				<SideBar selectedDate={this.props.selectedDate} events={this.props.events}/>
				<main className="calendar">
					<Filters currentDate={this.props.currentDate} selectedMonthIndex={this.props.selectedMonthIndex}/>
					<div className="calendar-table__wrapper">
						<div className="calendar-table">
							<div className="calendar-table__header">
								<div className="calendar-table__week">
									<div className="calendar-table__day calendar-table__day--weekday">Понедельник</div>
									<div className="calendar-table__day calendar-table__day--weekday">Вторник</div>
									<div className="calendar-table__day calendar-table__day--weekday">Среда</div>
									<div className="calendar-table__day calendar-table__day--weekday">Четверг</div>
									<div className="calendar-table__day calendar-table__day--weekday">Пятница</div>
									<div className="calendar-table__day calendar-table__day--weekday">Суббота</div>
									<div className="calendar-table__day calendar-table__day--weekday">Воскресенье</div>
								</div>
							</div>
							<div className="calendar-table__body">
								{this.getRows()}
							</div>
						</div>
					</div>
					<div className="calendar-footer"></div>
				</main>
			</div>
		);
	}
});

module.exports = CalendarView;