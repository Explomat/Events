import React from 'react';
import CheckBox from 'components/modules/checkbox';
import DropDownIcon from 'components/modules/dropdown-icon';
import SelectItems from 'components/modules/select-items';
import ToggleButton from 'components/modules/toggle-button';
import Message from 'components/modules/message';
import Info from 'components/modules/Info';
import EventEditActions from 'actions/EventEditActions';
import {some, filter} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-collaborators.scss';

class CollaboratorItem extends React.Component {

	handleToggleIsAssist(){
		EventEditActions.collaborators.toggleIsAssist(this.props.id, !this.props.isAssist);
	}

	handleToggleChecked(){
		EventEditActions.collaborators.toggleChecked(this.props.id, !this.props.checked);
	}

	render(){
		const {id, fullname, subdivision, position, isAssist, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		})
		return (
			<div className={classes}>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="fa fa-user"></i>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{position}</div>
				<div className="table-list__body-cell">{subdivision}</div>
				<div className="table-list__body-cell">
					<ToggleButton id={id} onChange={::this.handleToggleIsAssist} checked={isAssist} />
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

	handleToggleCheckedConditions(e, payload){
		EventEditActions.collaborators.toggleCheckedConditions(payload);
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
		const isSomeChecked = this._isSomeChecked() && this.props.collaborators.length > 0;

		const removeClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isSomeChecked
		});
		const notificateClasses = cx({
			'buttons__notificate': true,
			'buttons__notificate--display': isSomeChecked
		});
		const checkboxClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.collaborators.length > 0
		});
		const dropDownClasses = cx({
			'buttons__dropdown': true,
			'buttons__dropdown--display': this.props.collaborators.length > 0
		});

		const items = this._prepareNotificateForModal(this.props.collaborators);
		const isShowInfoModal = this.props.infoMessage !== '';
		
		const tableDescrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.collaborators.length === 0
		});
		return (
			<div className="event-edit-collaborators">
				<div className="buttons">
					<DropDownIcon onChange={this.handleToggleCheckedConditions} items={this.props.checkedTypes} className={checkboxClasses}>
						<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll}/>
					</DropDownIcon>
					<DropDownIcon onChange={this.handleSort} items={this.props.sortTypes} className={dropDownClasses}>
						<i className="fa fa-sort"></i>
					</DropDownIcon>
					<div className="buttons__funcs">
						<button onClick={::this.handleOpenModal} className="buttons__add" title="Добавить участников">
							<i className="fa fa-user-plus"></i>
						</button>
						<button onClick={this.handleRemoveItems} className={removeClasses} title="Удалить участников">
							<i className="fa fa-user-times"></i>
						</button>
						<button onClick={::this.handleOpenNotificateModal} className={notificateClasses} title="Отправить уведомление">
							<i className="fa fa-paper-plane"></i>
						</button>
					</div>
				</div>
				<div className="table-list collaborators-list">
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