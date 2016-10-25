import React, { Component } from 'react';
import SearchBar from 'components/modules/search-bar';
import { DropDownIcon, DropDownIconItem } from 'components/modules/dropdown-icon';
import { ModalBox, ModalBoxContent, ModalBoxHeader, ModalBoxBody, ModalBoxFooter } from 'components/modules/modal';
import { TextAreaView } from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import {AlertDanger} from 'components/modules/alert';
import Portal from 'components/modules/portal';

import ReasonMissEventActions from 'actions/ReasonMissEventActions';
import ReasonMissEventStore from 'stores/ReasonMissEventStore';

import cx from 'classnames';
import config from 'config';

import './style/reason-miss-event.scss';
import './style/table-list.scss';

function getState() {
	return { reason: ReasonMissEventStore.getData() };
}

class UserItem extends React.Component {

	constructor(props){
		super(props);
		
		const { payloads } = props;
		this.state = { 
			isDisplayModal: false,
			isDisplayPlaceholder: true, 
			selectedPayload: (payloads && payloads.length ? payloads[0].payload : null),
			reason: ''
		};
	}

	_getModal(){
		const {isDisplayPlaceholder, selectedPayload, reason} = this.state;
		const { payloads, placeholders } = this.props;
		const placeholderClasses = cx({
			'modal__placeholder': true,
			'modal__placeholder--display': isDisplayPlaceholder
		})
		return (
				<ModalBox className="modal__container" delay={0}>
					<ModalBoxContent>
						<ModalBoxHeader onClose={::this.handleToggleModal}>
							<span>Укажите причину</span>
						</ModalBoxHeader>
						<ModalBoxBody>
							<DropDown onChange={::this.handleChangePayload} className="modal__dropdown" items={payloads} selectedPayload={selectedPayload}/>
							<div onClick={::this.handleHidePlaceholder} className={placeholderClasses}>{placeholders[selectedPayload]}</div>
							<TextAreaView ref="textarea" onChange={::this.handleChangeReason} value={reason}/>
						</ModalBoxBody>
						<ModalBoxFooter>
							<button className="default-button" disabled={reason === ''} onClick={::this.handleRemoveUser}>Сохранить</button>
						</ModalBoxFooter>
					</ModalBoxContent>
				</ModalBox>
			);
	}

	handleChangePayload(e, payload) {
		this.setState({selectedPayload: payload, isDisplayPlaceholder: true, reason: ''});
	}

	handleChangeReason(value){
		this.setState({ reason: value });
	}

	handleHidePlaceholder(){
		this.setState({ isDisplayPlaceholder: false });
		this.refs.textarea.focus();
	}

	handleToggleModal(){
		const { isDisplayModal } = this.state;
		this.setState({ isDisplayModal: !isDisplayModal });
	}

	handleRemoveUser(){
		const { selectedPayload, reason } = this.state;
		const { eventResultID, onRemove } = this.props;
		this.setState({ isDisplayModal: false });
		if (onRemove){
			onRemove(eventResultID, selectedPayload, reason);
		}
	}

	render(){
		const {isDisplayModal} = this.state;
		const {userName, eventName, eventDate} = this.props;
		return (
			<div className="user-item table-list__body-row">
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="icon-user"></i>
				</div>
				<div className="table-list__body-cell">{userName}</div>
				<div className="table-list__body-cell">{eventName}</div>
				<div className="table-list__body-cell">{eventDate}</div>
				<div className="table-list__body-cell table-list__body-cell--10">
					<button className="default-button" onClick={::this.handleToggleModal} title="Указать причину">
						<span>Указать причину</span>
					</button>
				</div>
				<Portal nodeId={'modal'}>
					{ isDisplayModal && this._getModal()}
				</Portal>
			</div>
		);
	}
}

class ReasonMissEvent extends Component {

	componentDidMount() {
		ReasonMissEventStore.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		ReasonMissEventStore.removeChangeListener(this._onChange.bind(this));
	}

	_onChange() {
		this.setState(getState());
	}

	state = getState()

	handleSort(e, payload){
		ReasonMissEventActions.sortData(payload);
	}

	render(){
		const {filteredUsers, reasons, errorRemoveUser} = this.state.reason;
		const tableDescrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': filteredUsers.length === 0
		});
	    return (
	    	<div className="reason-miss-event">
	    		<div className="reason-miss-event__header">
	    			<a href="#calendar" className="icon-left-open-big reason-miss-event__icon"></a>
	    			<span className="reason-miss-event__description">Укажите причину</span>
	    		</div>
		        <div className="users">
		        	<div id="modal"></div>
		        	<SearchBar onSearch={ReasonMissEventActions.searchData} className="users__searchbar" classNameInput="users__searchbar-input"/>
		        	<span className="users__count">{filteredUsers.length}</span>
		        	<DropDownIcon
							icon={<i className="icon-arrow-combo"></i>} 
							className="users__sort default-button">
								<DropDownIconItem onClick={::this.handleSort} payload='{"key": "userName", "isAsc": "true"}' text='Сортировать по ФИО(А-я)'/>
								<DropDownIconItem onClick={::this.handleSort} payload='{"key": "userName", "isAsc": "false"}' text='Сортировать по ФИО(я-А)'/>
								<DropDownIconItem onClick={::this.handleSort} payload='{"key": "eventName", "isAsc": "true"}' text='Сортировать по мероприятию(А-я)'/>
								<DropDownIconItem onClick={::this.handleSort} payload='{"key": "eventName", "isAsc": "false"}' text='Сортировать по мероприятию(я-А)'/>
								<DropDownIconItem onClick={::this.handleSort} payload='{"key": "eventDate", "isAsc": "true"}' text='Сортировать по дате(по возрастанию)'/>
								<DropDownIconItem onClick={::this.handleSort} payload='{"key": "eventDate", "isAsc": "false"}' text='Сортировать по дате(по убыванию)'/>
					</DropDownIcon>
					{errorRemoveUser && <AlertDanger className="users__error" text={errorRemoveUser}/>}
					<div className="users__table">
			      		<div ref="table" className="table-list users__table-list">
							<span className={tableDescrClasses}>Нет данных</span>
							<div className="table-list__table">
								<div className="table-list__body">
									{filteredUsers.map(item => {
										return (<UserItem key={item.eventResultID} {...item} {...reasons} onRemove={ReasonMissEventActions.removeUser}/>)
									})}
								</div>
							</div>
						</div>
					</div>
		        </div>
		    </div>
	    )
  	}
}

export default ReasonMissEvent;