import React from 'react';
import ReactDOM from 'react-dom';
import CheckBox from 'components/modules/new-checkbox';
import DropDown from 'components/modules/dropdown';
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
			<ComposeLabel onIconClick={::this.handleRemoveTest} label={this.props.name} postIconClassName="fa fa-remove"/>
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
		var selectedItems = this._prepareTestsListForModal(this.props.prevTests);
		return this.state.isShowPrevTestsModal ? 
			<SelectItems
				title="Выберите тесты"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getTests'})}
				onClose={::this.handleClosePrevTestsModal} 
				onSave={::this.handleUpdatePrevTests}/> : null;
	}

	_getPostTestsModal(){
		var selectedItems = this._prepareTestsListForModal(this.props.postTests);
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

	render(){
		const {fullname, assessmentName, score} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{assessmentName}</div>
				<div className="table-list__body-cell">{score}</div>
			</div>
		);
	}
}

class Testing extends React.Component {

	componentDidMount(){
		this._updateHeight();
	}

	componentDidUpdate(){
		this._updateHeight();
	}

	_updateHeight(){
		var height = ReactDOM.findDOMNode(this).clientHeight;
		var tests = ReactDOM.findDOMNode(this.refs.tests);
		var table = this.refs.table;
		var dropdownHeight = this.props.testingList.length > 0 ? 35 : 0;
		table.style.height = (height - tests.clientHeight - dropdownHeight - 20) + 'px';
	}

	handleSort(e, payload){
		EventEditActions.testing.sortTable(payload);
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
		const tableDescrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.testingList.length === 0
		});
		const dropdownSortClasses = cx({
			'event-edit-testing__sort': true,
			'event-edit-testing__sort--display': this.props.testingList.length > 0
		});
		return (
			<div className="event-edit-testing">
				<Tests ref="tests" {...pick(this.props, ['isPrevTests', 'isPostTests', 'isPostTestOnlyForAssisst', 'postTests', 'prevTests'])}/>
				<DropDown
					className={dropdownSortClasses}
					onChange={::this.handleSort} 
					items={this.props.sortTypes}
					selectedPayload={this.props.selectedPayload}/>
				<div ref="table" className="table-list testing-list">
					<span className={tableDescrClasses}>Нет тестов</span>
					<div className="table-list__table">
						<div className="table-list__header">
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