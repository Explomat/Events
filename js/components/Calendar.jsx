import React from 'react';
import Auth from './modules/Auth';
import BusinessTypeFilter from './authmodules/BusinessTypeFilter';
import RegionsFilter from './authmodules/RegionsFilter';
import DropDown from './modules/dropdown';
import SearchBar from './modules/search-bar';
import TextOverflow from './modules/text-overflow';
import DateUtils from '../utils/event/DateUtils';
import EventUtils from '../utils/event/EventUtils';
import EventTypes from '../utils/event/EventTypes';
import EventStatuses from '../utils/event/EventStatuses';
import CalendarStore from '../stores/CalendarStore';
import CalendarActions from '../actions/CalendarActions';
import Config from '../config';

function getState() {
	return CalendarStore.getData();
}

var EventSideBar = React.createClass({

	getTime(){
		return DateUtils.getTime(this.props.startDate) + ' - ' + DateUtils.getTime(this.props.finishDate);
	},
	
	render(){
		var time = this.getTime();
		var typeIconClass = this.props.type === EventTypes.keys.webinar ? 'icon--type--webinar': 'icon--type--fulltime';
		var statusIconClass = 'status-icon--' + this.props.status;
		return(
			<section className="timetable__event clearfix">
				<div className="timetable__event-info-wrapper">
					<i className="info-icon fa fa-clock-o"></i>
					<p className="timetable__event-info timetable__event-info--time">{time}</p>
					<i className={"icon icon--small "+ typeIconClass +" info-icon"}></i>
					<TextOverflow className={"timetable__event-info timetable__event-info--name"} value={this.props.name} rowsCount={2} />
					<i className="fa fa-map-marker info-icon"></i>
					<p className="timetable__event-info timetable__event-info--region">{this.props.place}</p>
				</div>
				<a href={"#event/view/" + this.props.id} className="event-btn timetable__event-details-btn">Подробнее</a>
			</section>
		);
	}
})

var SideBar = React.createClass({

	propsTypes: {
		events: React.PropTypes.array
	},

	getDefaultProps () {
		return {
			events: []
		}
	},

	getSelectedEvents(selectedDate, events){
		return this.props.events.filter(function(ev){
			return DateUtils.compare(selectedDate, ev.startDate);
		})
	},

	render() {
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

	handleChangeMonth(e, payload, text, index){
		if (this.props.onChangeMonth) this.props.onChangeMonth(payload);
		CalendarActions.changeMonth(index, this.props.selectedYear, this.props.selectedBusinessType, this.props.selectedRegion);
	},

	handleChangeYear(e, payload, text, index){
		if (this.props.onChangeYear) this.props.onChangeYear(payload);
		CalendarActions.changeYear(payload, this.props.selectedMonthIndex, this.props.selectedBusinessType, this.props.selectedRegion);
	},

	handleChangeRegion(e, payload, text, index){
		if (this.props.onChangeRegion) this.props.onChangeRegion(payload);
		CalendarActions.changeRegion(this.props.selectedMonthIndex, this.props.selectedYear, this.props.selectedBusinessType, payload);
	},

	handleChangeBusinessType(e, payload, text, index){
		if (this.props.onChangeBusinessType) this.props.onChangeBusinessType(payload);
		CalendarActions.changeBusinessType(this.props.selectedMonthIndex, this.props.selectedYear, payload, this.props.selectedRegion);
	},

	handleChangeStatus(e, payload, text, index){
		CalendarActions.changeStatus(payload);
	},

	handleChangeSearchText(val){
		CalendarActions.changeSearchText(val);
	},

	render() {
		var componentsDenied = CalendarStore.getUserComponentsDenied();
		return (
			<header className="calendar-header">
				<div className="calendar-header__left-block">
					<DropDown onChange={this.handleChangeMonth} items={this.props.months} selectedPayload={this.props.selectedMonthIndex} className={"calendar-header__months"} classNameButton={"calendar-header__months-button"}/>
					<DropDown onChange={this.handleChangeYear} items={this.props.years} selectedPayload={this.props.selectedYear} className={"calendar-header__years"} classNameButton={"calendar-header__years-button"}/>
				</div>
				<div className="calendar-header__right-block">
					<Auth componentsDenied={componentsDenied}>
						<BusinessTypeFilter onChange={this.handleChangeBusinessType} items={this.props.businessTypes} selectedPayload={this.props.selectedBusinessType}/>
					</Auth>
					<Auth componentsDenied={componentsDenied}>
						<RegionsFilter onChange={this.handleChangeRegion} items={this.props.regions} selectedPayload={this.props.selectedRegion}/>
					</Auth>
					<DropDown onChange={this.handleChangeStatus} items={this.props.statuses} selectedPayload={this.props.selectedStatus} deviders={[1]} className={"calendar-header__status"} classNameButton={"calendar-header__status-button"}/>
					<SearchBar onSearch={this.handleChangeSearchText} value={this.props.searchText} className={"calendar-header__search"} />
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

	getDefaultProps(){
		return {
			day: '',
			isCurrentDay: false,
			events: []
		}
	},

	handleClick(){
		if (this.props.onClick){
			this.props.onClick(this.props.date);
		}
	},

	getEventsMarkup() {
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

	render(){
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

var Calendar = React.createClass({

	propsTypes: {
		currentDate(props, propName){
			if (typeof(props[propName] !== Date)) {
				return new Error('Validation for \'currentDate\' failed!');
			}
		},
		selectedDate(props, propName){
			if (typeof(props[propName] !== Date)) {
				return new Error('Validation for \'currentDate\' failed!');
			}
		},
		events: React.PropTypes.array
	},

	componentDidMount() {
		CalendarStore.addChangeListener(this._onChange);
	},

	componentWillUnmount() {
		CalendarStore.removeChangeListener(this._onChange);
	},

	getInitialState () {
		return getState();
	},

	getDefaultProps(){
		return {
			events: []
		}
	},

	_onChange() {
		this.setState(getState());
	},

	_getDay(date){
		if (!date) return -1;

		var day = date.getDay();
		if (day === 0) day = 7;
		return day - 1;
	},

	_getLastDateInMonth(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0);
	},

	_getEventsForDate(date){
		var _events = [];
		var filterEvents = this.state.filterEvents;
		for (var i = filterEvents.length - 1; i >= 0; i--) {
			var ev = filterEvents[i];
			if (DateUtils.compare(ev.startDate, date)) _events.push(ev);
		};
		return _events;
	},

	getFiltersProps(){
		return {
			currentDate: this.state.currentDate,
			years: this.state.years,
			months: this.state.months,
			businessTypes: this.state.businessTypes,
			regions: this.state.regions,
			statuses: this.state.statuses,
			selectedYear: this.state.selectedYear,
			selectedMonthIndex: this.state.selectedMonthIndex,
			selectedBusinessType: this.state.selectedBusinessType,
			selectedRegion: this.state.selectedRegion,
			selectedStatus: this.state.selectedStatus,
			searchText: this.state.searchText
		}
	},

	getRows(){
		var rows = [];
		var currentDate = this.state.currentDate;
		var startDate = new Date(this.state.selectedYear, this.state.selectedMonthIndex);
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
					isSelectedDay: DateUtils.compare(this.state.selectedDate, startDate),
					events: isCurrentMonth ? this._getEventsForDate(startDate) : []
				}
				cells.push(<CalendarCell key={j} {...dayProps}/>);
				startDate.setDate(curDay + 1);
			};
			rows.push(<div className="calendar-table__week" key={i}>{cells}</div>);
		};
		return rows;
	},


	handleSelectDate(date){
		CalendarActions.selectDate(date);
	},

	handleLoading(){
		CalendarActions.loading(true);
	},

	render() {
		var filtersProps = this.getFiltersProps();
		var isLoadingClass = this.state.isLoading ? 'overlay-loading--show ': '';
		return (
			<div className="container">
				<SideBar selectedDate={this.state.selectedDate} events={this.state.filterEvents}/>
				<main className="calendar">
					<Filters {...filtersProps} onChangeMonth={this.handleLoading} onChangeYear={this.handleLoading} onChangeBusinessType={this.handleLoading} onChangeRegion={this.handleLoading}/>
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

export default Calendar;