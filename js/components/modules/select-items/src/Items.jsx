import React from 'react';
import {some} from 'lodash';
import cx from 'classnames';

class HeaderCol extends React.Component {

	constructor(props){
		super(props);
		this.handleSort = this.handleSort.bind(this);
	} 	

	static contextTypes = {
		onSort: React.PropTypes.func
	}

	static propTypes = {
		name: React.PropTypes.string,
		type: React.PropTypes.string,
		onSort: React.PropTypes.func
	}

	static defaultProps = {
		name: ''
	}

	handleSort(){
		if (this.context.onSort) {
			let caret = this.refs.caret;
			this.context.onSort(this.props.index, caret.classList.contains('caret--rotate'));
			caret.classList.toggle('caret--rotate');
		}
	}

	render(){
		return(
			<th onClick={this.handleSort} className="header-row__col">
				<span className="header-row__col-name">{this.props.name}</span>
				<span ref="caret" className="caret header-row__caret"></span>
			</th>
		);
	}
};

class Item extends React.Component {

	constructor(props){
		super(props);
		this.handleAddItem = this.handleAddItem.bind(this);
	} 	

	static contextTypes = {
		onAddItem: React.PropTypes.func
	}

	static propTypes = {
		data: React.PropTypes.object,
		isSelected: React.PropTypes.bool
	}

	static defaultProps = {
		data: {},
		isSelected: false
	}

	handleAddItem(){
		if (this.context.onAddItem){
			this.context.onAddItem({...this.props});
		}
	}

	getMarkup(){
		var data = this.props.data;
		var classesButton = cx({
			'body-row__add-btn': true,
			'event-btn': !this.props.isSelected,
			'body-row__add-btn--selected': this.props.isSelected
		});
		var classesIcon = cx({
			'icon-plus': !this.props.isSelected,
			'icon-check': this.props.isSelected
		});
		return (
			<tr className="body-row" onClick={this.handleAddItem}>
				<td>
					<button className={classesButton}>
						<i className={classesIcon}></i>
					</button>
				</td>
				{Object.keys(data).map((c, index) => {
					return <td key={index} className="body-row__col oneline">{data[c]}</td>
				})}
			</tr>
		);
	}

	render(){
		return this.getMarkup();
	}
};

class Items extends React.Component { 	

	static propTypes = {
		headerCols: React.PropTypes.array,
		items: React.PropTypes.array,
		selectedItems: React.PropTypes.array
	}

	static defaultProps = {
		headerCols: [],
		items: [],
		selectedItems: []
	}

	getColsMarkup(){
		var headerCols = this.props.headerCols;
		var markUpCols = [<th key={0}></th>];
		headerCols.forEach((c, index) => {
			markUpCols.push(<HeaderCol key={index + 1} name={c.name} index={index}/>);
		});
		return markUpCols;
	}

	getRowsMarkUp(){
		var items = this.props.items;
		var selectedItems = this.props.selectedItems;
		return items.map((i, index) => {
			let isSelected = some(selectedItems, {id: i.id});
			return <Item key={index} {...i} isSelected={isSelected}/>
		});
	}

	render() {
		const cols = this.getColsMarkup();
		const items = this.getRowsMarkUp();
		const isLoadingClass = cx({
			'overlay-loading': true,
			'overlay-loading--show': this.props.isLoading
		});
		return(
			<div className="items-wrapper">
				<table className="items-wrapper__header">
					<thead>
						<tr className="header-row">{cols}</tr>
					</thead>
				</table>
				<div className="items-wrapper__body">
					<table className="items">
						<tbody className="items__body">
							{items}
						</tbody>
					</table>
				</div>
				
				<div className={isLoadingClass}></div>
			</div>
			
		);
	}
};

export default Items;