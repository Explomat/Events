import React from 'react';
import CheckBox from 'components/modules/checkbox';
import SelectItems from 'components/modules/select-items';
import Message from 'components/modules/message';
import Info from 'components/modules/Info';
import EventEditActions from 'actions/EventEditActions';
import {some, filter} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-collaborators.scss';

class Buttons extends React.Component {
	render(){
		let removeClasses = cx({
			'event-btn': true,
			'buttons__remove': true,
			'buttons__remove--display': this.props.isDisplay
		});
		let notificateClasses = cx({
			'event-btn': true,
			'buttons__notificate': true,
			'buttons__notificate--display': this.props.isDisplay
		});
		return (
			<div className="buttons">
				<button onClick={this.props.onAdd} className="event-btn buttons__add">Добавить</button>
				<button onClick={this.props.onRemove} className={removeClasses}>Удалить</button>
				<button onClick={this.props.onNotificate} className={notificateClasses}>Отправить уведомление</button>
			</div>
		);
	}
}

class CollaboratorItem extends React.Component {

	handleToggleIsAssist(){
		EventEditActions.collaborators.toggleIsAssist(this.props.id, !this.props.isAssist);
	}

	handleToggleChecked(){
		EventEditActions.collaborators.toggleChecked(this.props.id, !this.props.checked);
	}

	render(){
		let {fullname, subdivision, position, isAssist, checked} = this.props;
		return (
			<div className="collaborator-list__body-row">
				<div className="collaborator-list__body-cell">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="collaborator-list__body-cell">{fullname}</div>
				<div className="collaborator-list__body-cell">{position}</div>
				<div className="collaborator-list__body-cell">{subdivision}</div>
				<div className="collaborator-list__body-cell">
					<div className="toggle-btn">
						<input onChange={::this.handleToggleIsAssist} type="checkbox" className="toggle__input"  id={this.props.id} checked={isAssist}/>
						<label className="toggle__checkbox" htmlFor={this.props.id}></label>
					</div>
				</div>
			</div>
		);
	}
}

class Collaborators extends React.Component {

	constructor(props){
		super(props);
		this.handleUpdateItems = this.handleUpdateItems.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleCloseNotificateModal = this.handleCloseNotificateModal.bind(this);
		this.handleNotificateItems = this.handleNotificateItems.bind(this);
	}

	state = {
		isShowModal: false,
		isShowNotificateModal: false
	}

	_isSomeChecked(){
		return some(this.props.collaborators, {checked: true}) || this.props.checkedAll;
	}

	_prepareCollaboratorsForModal(collaborators){
		return collaborators.map((col) => {
			return {
				id: col.id,
				data: {
					fullname: col.fullname,
					subdivision: col.subdivision,
					position: col.position,
					isAssist: col.isAssist,
					checked: col.checked
				}	
			}
		})
	}

	_prepareNotificateForModal(collaborators){
		let selectedItems = filter(collaborators, (col) => {
			return col.checked;
		});
		let notSelectedItems = filter(collaborators, (col) => {
			return !col.checked;
		});
		return {
			selectedItems: selectedItems,
			notSelectedItems: notSelectedItems
		}
	}

	_getCollaboratorsModal(){
		let selectedItems = this._prepareCollaboratorsForModal(this.props.collaborators);
		return this.state.isShowModal ? 
			<SelectItems
				title="Выберите участников"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getCollaborators'})}
				onClose={this.handleCloseModal} 
				onSave={this.handleUpdateItems}/> : null;
	}

	handleSort(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.collaborators.sortCollaboratorsTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	handleToggleCheckedAll(){
		EventEditActions.collaborators.toggleCheckedAll(!this.props.checkedAll);
	}

	handleRemoveItems(){
		EventEditActions.collaborators.removeItems();
	}

	handleNotificateItems(items, subject, body){
		EventEditActions.collaborators.notificateItems(items, subject, body);
		this.setState({isShowNotificateModal: false});
	}

	handleOpenNotificateModal(){
		this.setState({isShowNotificateModal: true});
	}

	handleOpenModal(){
		this.setState({isShowModal: true});
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleCloseNotificateModal(){
		this.setState({isShowNotificateModal: false});
	}

	handleUpdateItems(items){
		this.setState({isShowModal: false});
		EventEditActions.collaborators.updateItems(items);
	}

	handleRemoveInfoMessage(){
		EventEditActions.collaborators.changeInfoMessage('');
	}

	render(){
		let items = this._prepareNotificateForModal(this.props.collaborators);
		let isShowInfoModal = this.props.infoMessage !== '';
		let checkBoxContainerClasses = cx({
			'collaborator-list__header-cell': true,
			'collaborator-list__header-cell--w1': true,
			'collaborator-list__header-cell--no-hover': true,
			'collaborator-list__header-cell--hide': this.props.collaborators.length === 0
		});
		let isDisplayButtons = this._isSomeChecked() && this.props.collaborators.length > 0;
		return (
			<div className="event-edit-collaborators">
				<Buttons onRemove={this.handleRemoveItems} onNotificate={::this.handleOpenNotificateModal} onAdd={::this.handleOpenModal} isDisplay={isDisplayButtons}/>
				<div className="collaborator-list">
					<div className="collaborator-list__header collaborator-list__header--header">
						<div className="collaborator-list__header-row">
							<div className={checkBoxContainerClasses}>
								<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll}/>
							</div>
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w30" data-sort="fullname">
								<span className="collaborator-list__header-cell-name">ФИО</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w25" data-sort="position">
								<span className="collaborator-list__header-cell-name">Должность</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w25" data-sort="subdivision">
								<span className="collaborator-list__header-cell-name">Подразделение</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w1" data-sort="isAssist">
								<span className="collaborator-list__header-cell-name">Статус</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="collaborator-list__table collaborator-list__table--collaborators">
						<div className="collaborator-list__header">
							<div className="collaborator-list__header-row">
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w1"></div>
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w30">ФИО</div>
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w25">Должность</div>
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w25">Подразделение</div>
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w1">Статус</div>
							</div>
							{this.props.collaborators.map((item, index) => {
								return <CollaboratorItem key={index} {...item}/>
							})}
						</div>
					</div>
					<Info
						status={this.props.infoStatus}
						message={this.props.infoMessage}
						isShow={isShowInfoModal}
						onClose={this.handleRemoveInfoMessage}/>
					<Message
						title="Новое уведомление"
						selectedItems={items.selectedItems}
						notSelectedItems={items.notSelectedItems}
						onClose={this.handleCloseNotificateModal} 
						onSend={this.handleNotificateItems}
						isShow={this.state.isShowNotificateModal}/>
					{this._getCollaboratorsModal()}
				</div>
			</div>
		);
	}
};

export default Collaborators;