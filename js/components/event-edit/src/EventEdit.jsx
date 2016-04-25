import React from 'react';

import SideBar from './SideBar';
import Info from 'components/modules/info';
import Base from './tabs/Base';
import Collaborators from './tabs/Collaborators';
import Files from './tabs/Files';
import Courses from './tabs/Courses';
import Requests from './tabs/Requests';
import Testing from './tabs/Testing';
import Tutors from './tabs/Tutors';

//import Hasher from '../../../utils/Hasher';
import EventEditActions from '../../../actions/EventEditActions';
import EventEditStore from '../../../stores/EventEditStore';
import {merge} from 'lodash';

import './style/event-edit.scss';
import './style/table-list.scss';

function getEventEditState() {
	return EventEditStore.getData();
}

class EventEdit extends React.Component {

	constructor(props){
		super(props);
		this.sideBarComponents = {'base': Base, 'requests': Requests, 'collaborators': Collaborators, 'tutors': Tutors, 'testing': Testing, 'files': Files, 'courses': Courses};
		this._onChange = this._onChange.bind(this);
		this.getTabView = this.getTabView.bind(this);
		this.handleSelectTab = this.handleSelectTab.bind(this);
	}

	state = merge(getEventEditState(), {
		selectedTab: { key: 'base', value: 'Основные' }
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
		var partialState = EventEditStore.getPartialData(tabName);
		var Component = this.sideBarComponents[tabName];
		return Component ? <Component {...partialState}/> : null;
	}

	handleSelectTab(tabName){
		this.setState({selectedTab: tabName})
	}

	handleSaveData(){
		if (EventEditStore.isRequiredFieldsFilled()){
			EventEditActions.saveData(EventEditStore.getData());
			return;
		}
		EventEditActions.changeInfoMessage(`Вы не заполнили обязательные поля в мероприятии, помеченные ' * '  !`, 'error');
	}

	handleRemoveInfoMessage(){
		EventEditActions.changeInfoMessage('');
	}

	render(){
		var tabView = this.getTabView(this.state.selectedTab.key);
		const isShowInfoModal = this.state.infoMessage !== '';
		return(
			<div className="container">
				<SideBar onSelect={this.handleSelectTab} selectedTab={this.state.selectedTab.key}/>
				<div className="calendar">
					<header className ="calendar-header">
						<span className="calendar-header__description">{this.state.selectedTab.value}</span>
					</header>
					<div className="event-edit-container">
						<div className="event-edit">
							<div className="event-edit__wrapper">
								{tabView}
							</div>
						</div>
						<button className="event-edit-container__save-button event-btn event-btn--reverse" onClick={this.handleSaveData}>
							<i className="icon-floppy-o event-edit-container__icon"></i>
							<span>Сохранить</span>
						</button>
						<button className="event-edit-container__complete-button event-btn event-btn--reverse" onClick={this.handleSaveData}>
							<i className="icon-share-square-o event-edit-container__icon"></i>
							<span>Завершить</span>
						</button>
					</div>
				</div>
				<Info
					status={this.state.infoStatus}
					message={this.state.infoMessage}
					isShow={isShowInfoModal}
					onClose={this.handleRemoveInfoMessage}/>
			</div>
		);
	}
};

export default EventEdit;