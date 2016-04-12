import React from 'react';
import CheckBox from 'components/modules/checkbox';
import DropDown from 'components/modules/dropdown';
import SelectItems from 'components/modules/select-items';
import EventEditActions from 'actions/EventEditActions';
import {some} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-tutors.scss';

class Buttons extends React.Component {
	render(){
		const removeClasses = cx({
			'event-btn': true,
			'buttons__remove': true,
			'buttons__remove--display': this.props.isDisplay
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
				<CheckBox onChange={this.props.onChecked} checked={this.props.checked} className={checkboxClasses}/>
				<DropDown className={dropDownClasses}  onChange={this.props.handleSort} items={this.props.sortTypes} selectedPayload={this.props.selectedPayload}/>
				<button onClick={this.props.onAdd} className="event-btn buttons__add">Добавить</button>
				<button onClick={this.props.onRemove} className={removeClasses}>Удалить</button>
			</div>
		);
	}
}

class TutorItem extends React.Component {

	handleToggleIsMain(){
		EventEditActions.tutors.toggleTutorIsMain(this.props.id, !this.props.main);
	}

	handleToggleChecked(){
		EventEditActions.tutors.toggleTutorChecked(this.props.id, !this.props.checked);
	}

	render(){
		var {fullname, subdivision, position, main, checked} = this.props;
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
						<input onChange={::this.handleToggleIsMain} type="checkbox" className="toggle__input" id={this.props.id} checked={main}/>
						<label className="toggle__checkbox" htmlFor={this.props.id}></label>
					</div>
				</div>
			</div>
		);
	}
}

class LectorItem extends React.Component {

	handleToggleChecked(){
		EventEditActions.tutors.toggleLectorChecked(this.props.id, !this.props.checked);
	}

	render(){
		const {fullname, type, checked} = this.props;
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
				<div className="table-list__body-cell">{type}</div>
			</div>
		);
	}
}

class Tutors extends React.Component {

	constructor(props){
		super(props);

		this.handleUpdateTutors = this.handleUpdateTutors.bind(this);
		this.handleUpdateLectors = this.handleUpdateLectors.bind(this);

		this.handleCloseTutorsModal= this.handleCloseTutorsModal.bind(this);
		this.handleCloseLectorsModal= this.handleCloseLectorsModal.bind(this);
	}

	state = {
		isShowTutorsModal: false,
		isShowLectorsModal: false
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
					fullname: l.fullname,
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
				onClose={this.handleCloseTutorsModal} 
				onSave={this.handleUpdateTutors}/> : null;
	}

	_getLectorsModal(){
		let selectedItems = this._prepareLectorsForModal(this.props.lectors);
		return this.state.isShowLectorsModal ? 
			<SelectItems
				title="Выберите преподавателей"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getLectors'})}
				onClose={this.handleCloseLectorsModal} 
				onSave={this.handleUpdateLectors}/> : null;
	}

	handleSortTutors(e, payload){
		EventEditActions.tutors.sortTutorsTable(payload);
	}

	handleSortLectors(e, payload){
		EventEditActions.tutors.sortLectorsTable(payload);
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

	handleCloseTutorsModal(){
		this.setState({isShowTutorsModal: false});
	}

	handleCloseLectorsModal(){
		this.setState({isShowLectorsModal: false});
	}

	handleUpdateTutors(tutors){
		this.setState({isShowTutorsModal: false});
		EventEditActions.tutors.updateTutors(tutors);
	}

	handleUpdateLectors(lectors){
		this.setState({isShowLectorsModal: false});
		EventEditActions.tutors.updateLectors(lectors);
	}

	render(){
		const isDisplayTutorsButtons = this._isSomeChecked(this.props.tutors) && this.props.tutors.length > 0;
		const isDisplayLectorsButtons = this._isSomeChecked(this.props.lectors) && this.props.lectors.length > 0;
		const isDisplayTutorsCheckBox = this.props.tutors.length > 0;
		const isDisplayLectorsCheckBox = this.props.lectors.length > 0;
		const tableTutorsClasses = cx({
			'table-list': true,
			'tutor-list': true,
			'table-list--empty': this.props.tutors.length === 0
		});
		const tableLectorsClasses = cx({
			'table-list': true,
			'lector-list': true,
			'table-list--empty': this.props.lectors.length === 0
		});
		const tableDescTutorsrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.tutors.length === 0
		});
		const tableDescrLectorsClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.lectors.length === 0
		});
		return (
			<div className="event-edit-tutors">
				<div className="tutors">
					<Buttons
						isDisplayCheckBox={isDisplayTutorsCheckBox}
						onChecked={::this.handleToggleCheckedAllTutors}
						checked={this.props.checkedAllTutors}
						handleSort={this.handleSortTutors}
						sortTypes={this.props.sortTutorTypes}
						selectedPayload={this.props.selectedTutorPayload} 
						onRemove={this.handleRemoveTutors} 
						onAdd={::this.handleOpenTutorsModal} 
						isDisplay={isDisplayTutorsButtons}/>
					<strong className="tutors__description">Ответственные</strong>
					<div className={tableTutorsClasses}>
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
					<Buttons
						isDisplayCheckBox={isDisplayLectorsCheckBox}
						onChecked={::this.handleToggleCheckedAllLectors}
						checked={this.props.checkedAllLectors}
						handleSort={this.handleSortLectors}
						sortTypes={this.props.sortLectorTypes}
						selectedPayload={this.props.selectedLectorPayload}  
						onRemove={this.handleRemoveLectors} 
						onAdd={::this.handleOpenLectorsModal} 
						isDisplay={isDisplayLectorsButtons}/>
					<strong className="lectors__description">Преподаватели</strong>
					<div className={tableLectorsClasses}>
						<span className={tableDescrLectorsClasses}>Нет преподавателей</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.lectors.map((item, index) => {
									return <LectorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getLectorsModal()}
					</div>
				</div>
			</div>
		);
	}
};

export default Tutors;