import React from 'react';
import CheckBox from 'components/modules/checkbox';
import SelectItems from 'components/modules/select-items';
import EventEditActions from 'actions/EventEditActions';
import {some} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-tutors.scss';

class Buttons extends React.Component {
	render(){
		let removeClasses = cx({
			'event-btn': true,
			'buttons__remove': true,
			'buttons__remove--display': this.props.isDisplay
		});
		return (
			<div className="buttons">
				<button onClick={this.props.onAdd} className="event-btn buttons__add">Добавить</button>
				<button onClick={this.props.onRemove} className={removeClasses}>Удалить</button>
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

class Tutors extends React.Component {

	constructor(props){
		super(props);
		this.handleUpdateItems = this.handleUpdateItems.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleCloseNotificateModal = this.handleCloseNotificateModal.bind(this);
		this.handleNotificateItems = this.handleNotificateItems.bind(this);
	}

	state = {
		isShowModal: false
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

	_getCollaboratorsModal(){
		let selectedItems = this._prepareCollaboratorsForModal(this.props.collaborators);
		return this.state.isShowModal ? 
			<SelectItems
				title="Выберите участников"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getTutors'})}
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

	handleOpenModal(){
		this.setState({isShowModal: true});
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleUpdateItems(items){
		this.setState({isShowModal: false});
		EventEditActions.collaborators.updateItems(items);
	}

	render(){
		let checkBoxContainerClasses = cx({
			'tutors-list__header-cell': true,
			'tutors-list__header-cell--w1': true,
			'tutors-list__header-cell--no-hover': true,
			'tutors-list__header-cell--hide': this.props.collaborators.length === 0
		});
		let isDisplayButtons = this._isSomeChecked() && this.props.collaborators.length > 0;
		return (
			<div className="event-edit-tutors">
				<div className="tutors">
					<Buttons onRemove={this.handleRemoveItems} onAdd={::this.handleOpenModal} isDisplay={isDisplayButtons}/>
					<div className="tutors-list">
						<div className="tutors-list__header tutors-list__header--header">
							<div className="tutors-list__header-row">
								<div className={checkBoxContainerClasses}>
									<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll}/>
								</div>
								<div onClick={this.handleSort} className="tutors-list__header-cell tutors-list__header-cell--w30" data-sort="fullname">
									<span className="tutors-list__header-cell-name">ФИО</span>
									<span className="caret tutors-list__caret"></span>
								</div>
								<div onClick={this.handleSort} className="tutors-list__header-cell tutors-list__header-cell--w25" data-sort="position">
									<span className="tutors-list__header-cell-name">Должность</span>
									<span className="caret tutors-list__caret"></span>
								</div>
								<div onClick={this.handleSort} className="tutors-list__header-cell tutors-list__header-cell--w25" data-sort="subdivision">
									<span className="tutors-list__header-cell-name">Подразделение</span>
									<span className="caret tutors-list__caret"></span>
								</div>
								<div onClick={this.handleSort} className="tutors-list__header-cell tutors-list__header-cell--w1" data-sort="isAssist">
									<span className="tutors-list__header-cell-name">Статус</span>
									<span className="caret tutors-list__caret"></span>
								</div>
							</div>
						</div>
						<div className="tutors-list__table tutors-list__table--collaborators">
							<div className="tutors-list__header">
								<div className="tutors-list__header-row">
									<div className="tutors-list__header-cell tutors-list__header-cell--w1"></div>
									<div className="tutors-list__header-cell tutors-list__header-cell--w30">ФИО</div>
									<div className="tutors-list__header-cell tutors-list__header-cell--w25">Должность</div>
									<div className="tutors-list__header-cell tutors-list__header-cell--w25">Подразделение</div>
									<div className="tutors-list__header-cell tutors-list__header-cell--w1">Статус</div>
								</div>
								{this.props.collaborators.map((item, index) => {
									return <CollaboratorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getCollaboratorsModal()}
					</div>
				</div>
				<div className="lectors">
					<Buttons onRemove={this.handleRemoveItems} onAdd={::this.handleOpenModal} isDisplay={isDisplayButtons}/>
					<div className="lectors-list">
						<div className="lectors-list__header lectors-list__header--header">
							<div className="lectors-list__header-row">
								<div className={checkBoxContainerClasses}>
									<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll}/>
								</div>
								<div onClick={this.handleSort} className="lectors-list__header-cell lectors-list__header-cell--w30" data-sort="fullname">
									<span className="lectors-list__header-cell-name">ФИО</span>
									<span className="caret lectors-list__caret"></span>
								</div>
								<div onClick={this.handleSort} className="lectors-list__header-cell lectors-list__header-cell--w25" data-sort="position">
									<span className="lectors-list__header-cell-name">Должность</span>
									<span className="caret lectors-list__caret"></span>
								</div>
								<div onClick={this.handleSort} className="lectors-list__header-cell lectors-list__header-cell--w25" data-sort="subdivision">
									<span className="lectors-list__header-cell-name">Подразделение</span>
									<span className="caret lectors-list__caret"></span>
								</div>
								<div onClick={this.handleSort} className="lectors-list__header-cell lectors-list__header-cell--w1" data-sort="isAssist">
									<span className="lectors-list__header-cell-name">Статус</span>
									<span className="caret lectors-list__caret"></span>
								</div>
							</div>
						</div>
						<div className="lectors-list__table lectors-list__table--collaborators">
							<div className="lectors-list__header">
								<div className="lectors-list__header-row">
									<div className="lectors-list__header-cell lectors-list__header-cell--w1"></div>
									<div className="lectors-list__header-cell lectors-list__header-cell--w30">ФИО</div>
									<div className="lectors-list__header-cell lectors-list__header-cell--w25">Должность</div>
									<div className="lectors-list__header-cell lectors-list__header-cell--w25">Подразделение</div>
									<div className="lectors-list__header-cell lectors-list__header-cell--w1">Статус</div>
								</div>
								{this.props.collaborators.map((item, index) => {
									return <CollaboratorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getCollaboratorsModal()}
					</div>
				</div>
			</div>
		);
	}
};

export default Tutors;