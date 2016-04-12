import React from 'react';
import CheckBox from 'components/modules/checkbox';
import DropDown from 'components/modules/dropdown';
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
		const removeClasses = cx({
			'event-btn': true,
			'buttons__remove': true,
			'buttons__remove--display': this.props.isDisplayButtons
		});
		const notificateClasses = cx({
			'event-btn': true,
			'buttons__notificate': true,
			'buttons__notificate--display': this.props.isDisplayButtons
		});
		const checkboxClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.isDisplayCheckBox
		});
		const dropDownClasses = cx({
			'buttons__dropdown': true,
			'buttons__dropdown--display': this.props.isDisplayCheckBox
		});
		return (
			<div className="buttons">
				<CheckBox onChange={this.props.onToggleChecked} checked={this.props.checkedAll} className={checkboxClasses}/>
				<DropDown className={dropDownClasses}  onChange={this.props.handleSort} items={this.props.sortTypes} selectedPayload={this.props.selectedPayload}/>
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
		const {fullname, subdivision, position, isAssist, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		})
		return (
			<div className={classes}>
				<div className="table-list__body-cell">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{position}</div>
				<div className="table-list__body-cell">{subdivision}</div>
				<div className="table-list__body-cell">
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
		return some(this.props.collaborators, {checked: true});
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
		var selectedItems = filter(collaborators, (col) => {
			return col.checked;
		});
		var notSelectedItems = filter(collaborators, (col) => {
			return !col.checked;
		});
		return {
			selectedItems: selectedItems,
			notSelectedItems: notSelectedItems
		}
	}

	_getCollaboratorsModal(){
		var selectedItems = this._prepareCollaboratorsForModal(this.props.collaborators);
		return this.state.isShowModal ? 
			<SelectItems
				title="Выберите участников"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getCollaborators'})}
				onClose={this.handleCloseModal} 
				onSave={this.handleUpdateItems}/> : null;
	}

	handleSort(e, payload){
		EventEditActions.collaborators.sortCollaboratorsTable(payload);
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
		const items = this._prepareNotificateForModal(this.props.collaborators);
		const isShowInfoModal = this.props.infoMessage !== '';
		const isDisplayButtons = this._isSomeChecked() && this.props.collaborators.length > 0;
		const isDisplayCheckBox = this.props.collaborators.length > 0;
		const tableClasses = cx({
			'table-list': true,
			'collaborators-list': true,
			'table-list--empty': this.props.collaborators.length === 0
		});
		const tableDescrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.collaborators.length === 0
		});
		return (
			<div className="event-edit-collaborators">
				<Buttons
					handleSort={this.handleSort}
					sortTypes={this.props.sortTypes}
					selectedPayload={this.props.selectedPayload}
					onToggleChecked={::this.handleToggleCheckedAll} 
					checkedAll={this.props.checkedAll}
					isDisplayCheckBox={isDisplayCheckBox}
					onRemove={this.handleRemoveItems} 
					onNotificate={::this.handleOpenNotificateModal} 
					onAdd={::this.handleOpenModal} 
					isDisplayButtons={isDisplayButtons}/>
				<div className={tableClasses}>
					<span className={tableDescrClasses}>Нет участников</span>
					<div className="table-list__table">
						<div className="table-list__header">
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