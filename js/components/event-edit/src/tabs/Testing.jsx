import React from 'react';
import CheckBox from 'components/modules/checkbox';
import SelectItems from 'components/modules/select-items';
import ComposeLabel from 'components/modules/compose-label';
import EventEditActions from 'actions/EventEditActions';
import {pick} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-testing.scss';

class Test extends React.Component {

	handleRemoveTest(){
		if (this.props.onRemove){
			this.props.onRemove(this.props.id);
		}
	}

	render(){
		return(
			<ComposeLabel onIconClick={::this.handleRemoveTest} label={this.props.name} />
		);
	}
}

class Tests extends React.Component {

	state = {
		isShowPrevTestsModal: false
	}

	_prepareTestsListForModal(tests){
		return tests.map((t) => {
			return {
				id: t.id,
				data: {
					name: t.name,
					code: t.code
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
				onSave={::this.handleUpdatePrevTests}/> : null;
	}

	_getPostTestsModal(){
		let selectedItems = this._prepareTestsListForModal(this.props.postTests);
		return this.state.isShowPostTestsModal ? 
			<SelectItems
				title="Выберите тесты"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getTests'})}
				onClose={::this.handleClosePostTestsModal} 
				onSave={::this.handleUpdatePostTests}/> : null;
	}

	handleUpdatePrevTests(items){
		this.setState({isShowPrevTestsModal: false});
		EventEditActions.testing.updatePrevTests(items);
	}

	handleUpdatePostTests(items){
		this.setState({isShowPostTestsModal: false});
		EventEditActions.testing.updatePostTests(items);
	}

	handleOpenPrevTestsModal(){
		this.setState({isShowPrevTestsModal: true});
	}

	handleOpenPostTestsModal(){
		this.setState({isShowPostTestsModal: true});
	}

	handleClosePrevTestsModal(){
		this.setState({isShowPrevTestsModal: false});
	}

	handleClosePostTestsModal(){
		this.setState({isShowPostTestsModal: false});
	}

	handleChangeIsPrevTests(checked){
		EventEditActions.testing.changeIsPrevTests(checked);
	}

	handleChangeIsPostTests(checked){
		EventEditActions.testing.changeIsPostTests(checked);
	}

	handleRemovePrevTest(id){
		EventEditActions.testing.removePrevTest(id);
	}

	handleRemovePostTest(id){
		EventEditActions.testing.removePostTest(id);
	}

	render(){
		const prevTestsClasses = cx({
			'event-edit-testing__prev-tests-add': true,
			'event-edit-testing__prev-tests-add--display': this.props.isPrevTests
		});
		const postTestsClasses = cx({
			'event-edit-testing__post-tests-add': true,
			'event-edit-testing__post-tests-add--display': this.props.isPostTests
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
								return <Test key={index} {...test} onRemove={this.handleRemovePrevTest}/>
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
						<button onClick={::this.handleOpenPostTestsModal} className="event-btn">Добавить</button>
						<div className="prev-tests">
							{this.props.postTests.map((test, index) => {
								return <Test key={index} {...test} onRemove={this.handleRemovePostTest}/>
							})}
						</div>
					</div>
				</div>
				{this._getPrevTestsModal()}
				{this._getPostTestsModal()}
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
		const {fullname, assessmentName, score, checked} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{assessmentName}</div>
				<div className="table-list__body-cell">{score}</div>
			</div>
		);
	}
}

class Testing extends React.Component {

	handleSort(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.testing.sortTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	handleToggleCheckedAll(){
		EventEditActions.testing.toggleCheckedAll(!this.props.checkedAll);
	}

	handleRemoveItems(){
		EventEditActions.testing.removeItems();
	}

	handleRemoveInfoMessage(){
		EventEditActions.testing.changeInfoMessage('');
	}

	render(){
		const checkBoxContainerClasses = cx({
			'table-list__header-cell': true,
			'table-list__header-cell--w1': true,
			'table-list__header-cell--no-hover': true,
			'table-list__header-cell--hide': this.props.testingList.length === 0
		});
		return (
			<div className="event-edit-testing">
				<Tests {...pick(this.props, ['isPrevTests', 'isPostTests', 'isPostTestOnlyForAssisst', 'postTests', 'prevTests'])}/>
				<div className="table-list testing-list">
					<div className="table-list__header table-list__header--header">
						<div className="table-list__header-row">
							<div className={checkBoxContainerClasses}>
								<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll}/>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w40" data-sort="fullname">
								<span className="table-list__header-cell-name">ФИО</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w40" data-sort="assessmentName">
								<span className="table-list__header-cell-name">Тест</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="score">
								<span className="table-list__header-cell-name">Результат</span>
								<span className="caret table-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="table-list__table">
						<div className="table-list__header">
							<div className="table-list__header-row">
								<div className="table-list__header-cell table-list__header-cell--w1"></div>
								<div className="table-list__header-cell table-list__header-cell--w40"></div>
								<div className="table-list__header-cell table-list__header-cell--w40"></div>
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