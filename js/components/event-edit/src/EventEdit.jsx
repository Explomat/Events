import React from 'react';

import SideBar from './SideBar';
import Info from 'components/modules/info';
import Base from './tabs/Base';
import Collaborators from './tabs/Collaborators';
import Files from './tabs/Files';
import Requests from './tabs/Requests';
import Testing from './tabs/Testing';
import Tutors from './tabs/Tutors';

import EventEditActions from 'actions/EventEditActions';
import EventEditStore from 'stores/EventEditStore';
import {merge} from 'lodash';

import './style/event-edit.scss';
import './style/table-list.scss';

function getEventEditState() {
	return EventEditStore.getData();
}

class EventEdit extends React.Component {

	constructor(props){
		super(props);
		this.fillError = 'Вы не заполнили обязательные поля в мероприятии, помеченные "звездочкой *" !';
		this.sideBarComponents = {'base': Base, 'requests': Requests, 'collaborators': Collaborators, 'tutors': Tutors, 'testing': Testing, 'files': Files};
		this._onChange = this._onChange.bind(this);
		this.getTabView = this.getTabView.bind(this);
		this.handleSelectTab = this.handleSelectTab.bind(this);
		this.state = merge(getEventEditState(), {
			selectedTab: { key: 'base', value: 'Основные' }
		});
	}

	componentDidMount() {
		EventEditStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		EventEditActions.disposeData();
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
		this.setState({selectedTab: tabName});
	}

	/*handleStartEvent(){
		if (EventEditStore.isRequiredFieldsFilled()){
			EventEditActions.changeStatus(EventStatuses.keys.active);
			return;
		}
		EventEditActions.changeInfoMessage(this.fillError, 'error');
	}

	handleCloseEvent(){
		if (EventEditStore.isRequiredFieldsFilled()){
			EventEditActions.changeStatus(EventStatuses.keys.close);
			return;
		}
		EventEditActions.changeInfoMessage(this.fillError, 'error');
	}*/

	handleSaveData(){
		if (EventEditStore.isRequiredFieldsFilled()){
			EventEditActions.saveData(EventEditStore.getData());
			return;
		}
		EventEditActions.changeInfoMessage(this.fillError, 'error');
	}

	handleRemoveInfoMessage(){
		EventEditActions.changeInfoMessage('');
	}

	render(){
		const {infoMessage, infoStatus, selectedTab} = this.state;
		var tabView = this.getTabView(selectedTab.key);
		const isShowInfoModal = infoMessage !== '';
		return(
			<div className="container">
				<SideBar onSelect={this.handleSelectTab} selectedTab={selectedTab.key}/>
				<div className="calendar">
					<header className ="calendar-header">
						<span className="calendar-header__description">{selectedTab.value}</span>
						<div className="calendar-header__action-buttons">
							<button className="event-edit-container__save-button event-btn event-btn--reverse" onClick={::this.handleSaveData}>
								<i className="icon-floppy-o event-edit-container__icon"></i>
								<span>Сохранить</span>
							</button>
						</div>
					</header>
					<div className="event-edit-container">
						<div className="event-edit">
							<div className="event-edit__wrapper">
								{tabView}
							</div>
						</div>
					</div>
				</div>
				<Info
					status={infoStatus}
					message={infoMessage}
					isShow={isShowInfoModal}
					onClose={this.handleRemoveInfoMessage}/>
			</div>
		);
	}
};

export default EventEdit;