var React = require('react');
var DropDown = require('./DropDown');
var SearchBox = require('./SearchBox');
var TextOverflow = require('./TextOverflow');
var DateUtils = require('../../utils/event/DateUtils');
var EventUtils = require('../../utils/event/EventUtils');
var EventStatuses = require('../../utils/event/EventStatuses');
var EventTypes = require('../../utils/event/EventTypes');
var CalendarActions = require('../../actions/CalendarActions');
var Hasher = require('../../utils/Hasher');
var Config = require('../../config');

var EventSideBar = React.createClass({

	getTime: function(){
		return DateUtils.getTime(this.props.startDate) + ' - ' + DateUtils.getTime(this.props.finishDate);
	},

	handleViewEvent: function(){
		Hasher.setHash('event/view/' + this.props.id);
	},

	render: function(){
		var time = this.getTime();
		var typeIconClass = this.props.type === EventTypes.keys.webinar ? 'icon--type--webinar': 'icon--type--fulltime';
		return(
			<section className="timetable__event clearfix">
				<div className="timetable__event-info-wrapper">
					<i className="info-icon fa fa-clock-o"></i>
					<p className="timetable__event-info timetable__event-info--time">{time}</p>
					<i className={"icon icon--small "+ typeIconClass +" info-icon"}></i>
					<TextOverflow className={"timetable__event-info timetable__event-info--name"} value={this.props.name} rowsCount={2} />
					<i className="info-icon fa fa-map-marker"></i>
					<p className="timetable__event-info timetable__event-info--place">{this.props.place}</p>
				</div>
				<button onClick={this.handleViewEvent} className="event-btn timetable__event-details-btn">Подробнее</button>
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
		var isDisplayMessageClass = selectedEvents.length === 0 ? 'timetable__message--show' : '';
		return (
			<aside className="timetable">
				<header className="timetable__header">
					<i className="timetable__header-icon fa fa-calendar"></i>
					<p className="timetable__header-date">{selectedDate}</p>
				</header>
				<div className={"timetable__message " + isDisplayMessageClass}>Нет мероприятий на выбранную дату</div>
				<div className="timetable__events">
					{selectedEvents.map(function(ev, index){
						return <EventSideBar key={index} {...ev} />
					})}
				</div>
			</aside>
		);
	}
});

var Filters = React.createClass({

	propsTypes: {
		selectedYear: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
		selectedMonthIndex: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired
	},

	handleChangeMonth: function(e, payload, text, index){
		if (payload === this.props.selectedMonthIndex) return;
		if (this.props.onChangeMonth) this.props.onChangeMonth(payload);
		CalendarActions.changeMonth(index, this.props.selectedYear);
	},

	handleChangeYear: function(e, payload, text, index){
		if (payload === this.props.selectedYear) return;
		if (this.props.onChangeYear) this.props.onChangeYear(payload);
		CalendarActions.changeYear(payload, this.props.selectedMonthIndex);
	},

	handleChangeStatus: function(e, payload, text, index){
		CalendarActions.changeStatus(payload);
	},

	handleChangeSearchText: function(val){
		CalendarActions.changeSearchText(val);
	},

	render: function() {
		return (
			<header className="calendar-header">
				<div className="calendar-header__left-block">
					<DropDown onChange={this.handleChangeMonth} items={this.props.months} selectedPayload={this.props.selectedMonthIndex} className={"calendar-header__months"} classNameButton={"calendar-header__months-button"}/>
					<DropDown onChange={this.handleChangeYear} items={this.props.years} selectedPayload={this.props.selectedYear} className={"calendar-header__years"} classNameButton={"calendar-header__years-button"}/>
				</div>
				<div className="calendar-header__right-block">
					<DropDown onChange={this.handleChangeStatus} items={this.props.statuses} selectedPayload={this.props.selectedStatus} className={"calendar-header__status"} classNameButton={"calendar-header__status-button"}/>
					<SearchBox onSearch={this.handleChangeSearchText} value={this.props.searchText} className={"calendar-header__search"} />
				</div>
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
		var events = [];
		var eventsCount = this.props.events.length;
		var eventsCountLimit = eventsCount <= 2 ? eventsCount : 2;
		for (var i = 0; i < eventsCountLimit; i++) {
			var ev = this.props.events[i];
			var classItem = "event-list__item--" + ev.status;
			events.push(<p key={i} className={"event-list__item " + classItem}>
							<span className="event-list__item-name">{ev.name}</span>
						</p>);
		};
		if (eventsCount > eventsCountLimit) {
			events.push(<p key={i + 1} className="event-list__item">
							<span className="event-list__item-count">Всего {eventsCount + " " + EventUtils.getInducingEvent(eventsCount)}</span>
						</p>);
		}
		return events;
	},

	render: function(){
		var cellClassName = this.props.isCurrentDay ? 'day__number--current' : '';
		var isHoverClass = !this.props.onClick && !this.props.day ? 'calendar-table__day--no-hover' : '';
		var isSelectedClass = this.props.isSelectedDay ? 'calendar-table__day--selected' : '';
		return (
			<div onClick={this.handleClick} className={"calendar-table__day " + isHoverClass + " " + isSelectedClass}>
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

	_getEventsForDate: function(date){
		var _events = [];
		var filterEvents = this.props.filterEvents;
		for (var i = filterEvents.length - 1; i >= 0; i--) {
			var ev = filterEvents[i];
			if (DateUtils.compare(ev.startDate, date)) _events.push(ev);
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

	getInitialState: function(){
		return {
			isLoading: false
		}
	},

	getDefaultProps: function(){
		return {
			events: []
		}
	},

	componentWillReceiveProps: function(nextProps){
		this.setState({isLoading: false});
	},

	getFiltersProps: function(){
		return {
			currentDate: this.props.currentDate,
			years: this.props.years,
			months: this.props.months,
			statuses: this.props.statuses,
			selectedYear: this.props.selectedYear,
			selectedMonthIndex: this.props.selectedMonthIndex,
			selectedStatus: this.props.selectedStatus,
			searchText: this.props.searchText
		}
	},

	getRows: function(){
		var rows = [];
		var currentDate = this.props.currentDate;
		var startDate = new Date(this.props.selectedYear, this.props.selectedMonthIndex);
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

				var dayProps = {
					onClick: isCurrentMonth ? this.handleSelectDate : undefined,
					day: curDay,
					date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
					isCurrentDay: DateUtils.compare(currentDate, startDate),
					isSelectedDay: DateUtils.compare(this.props.selectedDate, startDate),
					events: isCurrentMonth ? this._getEventsForDate(startDate) : []
				}
				cells.push(<CalendarCell key={j} {...dayProps}/>);
				startDate.setDate(curDay + 1);
			};
			rows.push(<div className="calendar-table__week" key={i}>{cells}</div>);
		};
		return rows;
	},


	handleSelectDate: function(date){
		CalendarActions.selectDate(date);
	},

	handleChangeMonth: function(){
		this.setState({ isLoading: true });
	},

	handleChangeYear: function(){
		this.setState({ isLoading: true });
	},

	render: function() {
		var filtersProps = this.getFiltersProps();
		var isLoadingClass = this.state.isLoading ? 'overlay-loading--show ': '';
		return (
			<div className="container">
				<SideBar selectedDate={this.props.selectedDate} events={this.props.filterEvents}/>
				<main className="calendar">
					<Filters {...filtersProps} onChangeMonth={this.handleChangeMonth} onChangeYear={this.handleChangeYear}/>
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
					<div className={"overlay-loading " + isLoadingClass}></div>
					<div id={Config.dom.eventViewModalId}></div>
				</main>
			</div>
		);
	}
});

module.exports = CalendarView;