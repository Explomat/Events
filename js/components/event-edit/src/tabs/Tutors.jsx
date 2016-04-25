import React from 'react';
import CheckBox from 'components/modules/new-checkbox';
import {DropDownIcon, DropDownIconItem} from 'components/modules/dropdown-icon';
import SelectItems from 'components/modules/select-items';
import ToggleButton from 'components/modules/toggle-button';
import EventEditActions from 'actions/EventEditActions';
import NewLector from '../NewLector';
import LectorTypes from 'utils/eventedit/LectorTypes';
import {some} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-tutors.scss';

class TutorItem extends React.Component {

	handleToggleIsMain(){
		EventEditActions.tutors.toggleTutorIsMain(this.props.id, !this.props.main);
	}

	handleToggleChecked(){
		EventEditActions.tutors.toggleTutorChecked(this.props.id, !this.props.checked);
	}

	render(){
		var {id, fullname, subdivision, position, main, checked} = this.props;
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
					<i className="icon-user"></i>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{position}</div>
				<div className="table-list__body-cell">{subdivision}</div>
				<div className="table-list__body-cell table-list__body-cell--5" title="Сделать основным">
					<ToggleButton id={id} onChange={::this.handleToggleIsMain} checked={main} />
				</div>
			</div>
		);
	}
}

class LectorItem extends React.Component {

	_getFullname(firstName, lastName, middleName){
		return firstName + " " + lastName + " " + middleName;
	}

	handleToggleChecked(){
		EventEditActions.tutors.toggleLectorChecked(this.props.id, !this.props.checked);
	}

	render(){
		const {firstName, lastName, middleName, type, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		});
		const fullname = this._getFullname(firstName, lastName, middleName);
		return (
			<div className={classes}>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="icon-user"></i>
				</div>
				<div className="table-list__body-cell table-list__body-cell--70">{fullname}</div>
				<div className="table-list__body-cell">{LectorTypes.values[type]}</div>
			</div>
		);
	}
}

class Tutors extends React.Component {

	state = {
		isShowTutorsModal: false,
		isShowLectorsModal: false,
		isShowNewLectorModal: false,
		isShowInnerLectorsModal: false
	}

	_isSomeChecked(items){
		return some(items, {checked: true});
	}

	_prepareTutorsForModal(tutors){
		return tutors.map((t) => {
			return {
				id: t.id,
				data: {
					fullname: t.fullname,
					subdivision: t.subdivision,
					position: t.position,
					main: t.main,
					checked: t.checked
				}	
			}
		})
	}

	_prepareLectorsForModal(lectors){
		return lectors.map((l) => {
			return {
				id: l.id,
				data: {
					fullname: l.firstName + " " + l.lastName + " " + l.middleName,
					type: l.type,
					checked: l.checked
				}	
			}
		})
	}

	_getTutorsModal(){
		let selectedItems = this._prepareTutorsForModal(this.props.tutors);
		return this.state.isShowTutorsModal ? 
			<SelectItems
				title="Выберите ответственных"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getCollaborators'})}
				onClose={::this.handleCloseTutorsModal} 
				onSave={::this.handleUpdateTutors}/> : null;
	}

	_getLectorsModal(){
		let selectedItems = this._prepareLectorsForModal(this.props.lectors);
		return this.state.isShowLectorsModal ? 
			<SelectItems
				title="Выберите преподавателей"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getLectors'})}
				onClose={::this.handleCloseLectorsModal} 
				onSave={::this.handleUpdateLectors}/> : null;
	}

	_getInnerLectorsModal(){
		let selectedItems = this._prepareLectorsForModal(this.props.lectors);
		return this.state.isShowInnerLectorsModal ? 
			<SelectItems
				title="Выберите преподавателей"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getCollaborators'})}
				onClose={::this.handleCloseInnerLectorsModal} 
				onSave={::this.handleUpdateInnerLectors}/> : null;
	}

	handleSortTutors(e, payload){
		EventEditActions.tutors.sortTutorsTable(payload);
	}

	handleSortLectors(e, payload){
		EventEditActions.tutors.sortLectorsTable(payload);
	}

	handleToggleCheckedTutorsConditions(e, payload){
		EventEditActions.tutors.toggleCheckedTutorsConditions(payload);
	}

	handleToggleCheckedAllTutors(){
		EventEditActions.tutors.toggleCheckedAllTutors(!this.props.checkedAllTutors);
	}

	handleToggleCheckedAllLectors(){
		EventEditActions.tutors.toggleCheckedAllLectors(!this.props.checkedAllLectors);
	}

	handleRemoveTutors(){
		EventEditActions.tutors.removeTutors();
	}

	handleRemoveLectors(){
		EventEditActions.tutors.removeLectors();
	}

	handleOpenTutorsModal(){
		this.setState({isShowTutorsModal: true});
	}

	handleOpenLectorsModal(){
		this.setState({isShowLectorsModal: true});
	}

	handleOpenNewLectorModal(){
		this.setState({isShowNewLectorModal: true});
	}

	handleOpenInnerLectorModal(){
		this.setState({isShowInnerLectorsModal: true});
	}

	handleCloseTutorsModal(){
		this.setState({isShowTutorsModal: false});
	}

	handleCloseLectorsModal(){
		this.setState({isShowLectorsModal: false});
	}

	handleCloseNewLectorModal(){
		this.setState({isShowNewLectorModal: false});
	}

	handleCloseInnerLectorsModal(){
		this.setState({isShowInnerLectorsModal: false});
	}

	handleUpdateTutors(tutors){
		this.setState({isShowTutorsModal: false});
		EventEditActions.tutors.updateTutors(tutors);
	}

	handleUpdateLectors(lectors){
		this.setState({isShowLectorsModal: false});
		EventEditActions.tutors.updateLectors(lectors);
	}

	handleUpdateInnerLectors(lectors){
		this.setState({isShowInnerLectorsModal: false});
		EventEditActions.tutors.updateInnerLectors(lectors);
	}

	handleSaveNewLector(lector){
		this.setState({isShowNewLectorModal: false});
		EventEditActions.tutors.createLector(lector);
	}

	handleSelectLectorType(e, payload){
		EventEditActions.tutors.selectLectorType(payload);
	}

	render(){
		const isDisplayTutorsButtons = this._isSomeChecked(this.props.tutors) && this.props.tutors.length > 0;
		const isDisplayLectorsButtons = this._isSomeChecked(this.props.lectors) && this.props.lectors.length > 0;

		const tableDescTutorsrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.tutors.length === 0
		});
		const tableDescrLectorsClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.lectors.length === 0
		});

		const removeTutorsClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayTutorsButtons,
			'default-button': true
		});
		const checkboxTutorsClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.tutors.length > 0
		});
		const dropDownTutorsClasses = cx({
			'buttons__dropdown': true,
			'buttons__dropdown--display': this.props.tutors.length > 0
		});

		const removeLectorsClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayLectorsButtons,
			'default-button': true
		});
		const checkboxLectorsClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.lectors.length > 0
		});
		const dropDownLectorsClasses = cx({
			'buttons__dropdown': true,
			'buttons__dropdown--display': this.props.lectors.length > 0
		});
		return (
			<div className="event-edit-tutors">
				<div className="tutors">
					<div className="buttons">
						<DropDownIcon 
							className={checkboxTutorsClasses}
							icon={<CheckBox 
									onChange={::this.handleToggleCheckedAllTutors} 
									checked={this.props.checkedAllTutors} 
									className={checkboxTutorsClasses}/>}>
							<DropDownIconItem onClick={this.handleToggleCheckedTutorsConditions} payload='{"main": "true"}' text='Выбрать основного' />
						</DropDownIcon>
						<DropDownIcon className={dropDownTutorsClasses} icon={<i className="icon-arrow-combo"></i>}>
							<DropDownIconItem onClick={this.handleSortTutors} payload='{"key": "fullname", "isAsc": "true"}' text='Сортировать по ФИО(А-я)'/>
							<DropDownIconItem onClick={this.handleSortTutors} payload='{"key": "fullname", "isAsc": "false"}' text='Сортировать по ФИО(А-я)'/>
						</DropDownIcon>
						<div className="buttons__funcs">
							<button onClick={::this.handleOpenTutorsModal} className="buttons__add default-button" title="Выбрать ответственных">
								<i className="icon-user-plus"></i>
							</button>
							<button onClick={this.handleRemoveTutors} className={removeTutorsClasses} title="Удалить ответственных">
								<i className="icon-user-times"></i>
							</button>
						</div>
					</div>
					<strong className="tutors__description">Ответственные *</strong>
					<div className="table-list tutor-list">
						<span className={tableDescTutorsrClasses}>Нет ответственных</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.tutors.map((item, index) => {
									return <TutorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getTutorsModal()}
					</div>
				</div>
				<div className="lectors">
					<div className="buttons">
						<DropDownIcon 
							className={checkboxLectorsClasses}
							icon={<CheckBox 
									onChange={::this.handleToggleCheckedAllLectors} 
									checked={this.props.checkedAllLectors} 
									className={checkboxLectorsClasses}/>}>
							<DropDownIconItem onClick={this.handleSelectLectorType} payload={'{"type": "' + LectorTypes.keys.collaborator + '"}'} text='Внутренние'/>
							<DropDownIconItem onClick={this.handleSelectLectorType} payload={'{"type": "' + LectorTypes.keys.invitee + '"}'} text='Внешние'/>
						</DropDownIcon>
						<DropDownIcon
							icon={<i className="icon-arrow-combo"></i>} 
							className={dropDownLectorsClasses}>
								<DropDownIconItem onClick={this.handleSortLectors} payload='{"key": "fullname", "isAsc": "true"}' text='Сортировать по ФИО(А-я)'/>
								<DropDownIconItem onClick={this.handleSortLectors} payload='{"key": "fullname", "isAsc": "false"}' text='Сортировать по ФИО(я-А)'/>
						</DropDownIcon>
						<div className="buttons__funcs">
							<button onClick={::this.handleOpenLectorsModal} className="buttons__add default-button" title="Выбрать преподавателей">
								<i className="icon-user-plus"></i>
							</button>
							<button onClick={this.handleRemoveLectors} className={removeLectorsClasses} title="Удалить преподавателей">
								<i className="icon-user-times"></i>
							</button>

							<DropDownIcon
								icon={<i className="icon-plus"></i>}
								className="buttons__add">
									<DropDownIconItem onClick={::this.handleOpenInnerLectorModal} payload='inner' text='Добавить внутреннего преподавателя'/>
									<DropDownIconItem onClick={::this.handleOpenNewLectorModal} payload='new' text='Добавить нового преподавателя'/>
							</DropDownIcon>
						</div>
					</div>
					<strong className="lectors__description">Преподаватели *</strong>
					<NewLector isShow={this.state.isShowNewLectorModal} onSave={::this.handleSaveNewLector} onClose={::this.handleCloseNewLectorModal} />
					<div className="table-list lector-list">
						<span className={tableDescrLectorsClasses}>Нет преподавателей</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.lectors.map((item, index) => {
									return <LectorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getLectorsModal()}
						{this._getInnerLectorsModal()}
					</div>
				</div>
			</div>
		);
	}
};

export default Tutors;