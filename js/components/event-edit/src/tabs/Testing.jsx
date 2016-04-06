import React from 'react';
import CheckBox from 'components/modules/checkbox';
import SelectItems from 'components/modules/select-items';
import EventEditActions from 'actions/EventEditActions';
import {some, pick} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-testing.scss';

class Tests extends React.Component {

	state = {
		isShowPrevTestsModal: false
	}

	_prepareTestsListForModal(tests){
		return tests.map((tl) => {
			return {
				id: tl.id,
				data: {
					fullname: tl.fullname,
					type: tl.type,
					finishDate: tl.finishDate,
					result: tl.result,
					checked: tl.checked
				}	
			}
		})
	}

	_getPrevTestsModal(){
		let selectedItems = this._prepareTestsListForModal(this.props.prevTests);
		return this.state.isShowPrevTestsModal ? 
			<SelectItems
				title="Выберите тесты"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getTests'})}
				onClose={::this.handleClosePrevTestsModal} 
				onSave={this.handleUpdateItems}/> : null;
	}

	handleOpenPrevTestsModal(){
		this.setState({isShowPrevTestsModal: true});
	}

	handleClosePrevTestsModal(){
		this.setState({isShowPrevTestsModal: false});
	}

	handleChangeIsPrevTests(){

	}

	handleChangeIsPostTests(){

	}

	handleAddPrevTests(){
		
	}

	handleAddPostTests(){
		
	}

	render(){
		const prevTestsClasses = cx({
			'event-edit-testing__prev-tests-add': true,
			'event-edit-testing__prev-tests-add--display': !this.props.isPrevTests
		});
		const postTestsClasses = cx({
			'event-edit-testing__post-tests-add': true,
			'event-edit-testing__post-tests-add--display': !this.props.isPostTests
		});
		return(
			<div className="event-edit-testing__tests">
				<div className="event-edit-testing__prev-tests">
					<CheckBox 
						onChange={this.handleChangeIsPrevTests} 
						label="Назначить предварительные тесты"
						checked={this.props.isPrevTests}/>
					<div className={prevTestsClasses}>
						<button onClick={::this.handleOpenPrevTestsModal} className="event-btn">Добавить</button>
						<div className="prev-tests">
							{this.props.prevTests.map((test, index) => {
								return <div key={index}>{test.name}</div>
							})}
						</div>
					</div>
				</div> 
				<div className="event-edit-testing__post-tests">
					<CheckBox 
						onChange={this.handleChangeIsPostTests} 
						label="Назначить пост-тесты" 
						checked={this.props.isPostTests}/>
					<div className={postTestsClasses}>
						<button onClick={::this.handleAddPostTests} className="event-btn">Добавить</button>
						<div className="prev-tests">
							{this.props.postTests.map((test, index) => {
								return <div key={index}>{test.name}</div>
							})}
						</div>
					</div>
				</div>
				{this._getPrevTestsModal()}
			</div>
		);
	}
}

class Buttons extends React.Component {
	render(){
		let addButtonClasses = cx({
			'event-btn': true,
			'buttons__re-active': true,
			'buttons__re-active--display': this.props.isDisplay
		});
		return (
			<div className="buttons">
				<button onClick={this.props.onReActive} className={addButtonClasses}>Переназначить</button>
			</div>
		);
	}
}

class TestingItem extends React.Component {

	handleToggleIsAssist(){
		EventEditActions.testing.toggleIsAssist(this.props.id, !this.props.isAssist);
	}

	handleToggleChecked(){
		EventEditActions.testing.toggleChecked(this.props.id, !this.props.checked);
	}

	render(){
		const {fullname, type, finishDate, result, checked} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{type}</div>
				<div className="table-list__body-cell">{finishDate}</div>
				<div className="table-list__body-cell">{result}</div>
				<div className="table-list__body-cell">
					<div className="toggle-btn">
						<input onChange={::this.handleToggleIsAssist} type="checkbox" className="toggle__input"  id={this.props.id} checked={checked}/>
						<label className="toggle__checkbox" htmlFor={this.props.id}></label>
					</div>
				</div>
			</div>
		);
	}
}

class Testing extends React.Component {

	constructor(props){
		super(props);
		this.handleUpdateItems = this.handleUpdateItems.bind(this);
	}

	_isSomeChecked(){
		return some(this.props.testingList, {checked: true});
	}

	handleSort(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.testing.sortTestingTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	handleToggleCheckedAll(){
		EventEditActions.testing.toggleCheckedAll(!this.props.checkedAll);
	}

	handleRemoveItems(){
		EventEditActions.testing.removeItems();
	}

	handleUpdateItems(items){
		this.setState({isShowModal: false});
		EventEditActions.testing.updateItems(items);
	}

	handleRemoveInfoMessage(){
		EventEditActions.testing.changeInfoMessage('');
	}

	handleReActive(){

	}

	render(){
		const checkBoxContainerClasses = cx({
			'table-list__header-cell': true,
			'table-list__header-cell--w1': true,
			'table-list__header-cell--no-hover': true,
			'table-list__header-cell--hide': this.props.testingList.length === 0
		});
		const isDisplayButtons = this._isSomeChecked() && this.props.testingList.length > 0;
		return (
			<div className="event-edit-testing">
				<Tests {...pick(this.props, ['isPrevTests', 'isPostTests', 'isPostTestOnlyForAssisst', 'postTests', 'prevTests'])}/>
				<Buttons onReActive={::this.handleReActive} isDisplay={isDisplayButtons}/>
				<div className="table-list testing-list">
					<div className="table-list__header table-list__header--header">
						<div className="table-list__header-row">
							<div className={checkBoxContainerClasses}>
								<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll}/>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w30" data-sort="fullname">
								<span className="table-list__header-cell-name">Название</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="type">
								<span className="table-list__header-cell-name">Тип</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="finishDate">
								<span className="table-list__header-cell-name">Дата завершения</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="result">
								<span className="table-list__header-cell-name">Результат (%)</span>
								<span className="caret table-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="table-list__table">
						<div className="table-list__header">
							<div className="table-list__header-row">
								<div className="table-list__header-cell table-list__header-cell--w1"></div>
								<div className="table-list__header-cell table-list__header-cell--w30"></div>
								<div className="table-list__header-cell table-list__header-cell--w20"></div>
								<div className="table-list__header-cell table-list__header-cell--w20"></div>
								<div className="table-list__header-cell table-list__header-cell--w20"></div>
							</div>
							{this.props.testingList.map((item, index) => {
								return <TestingItem key={index} {...item}/>
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Testing;