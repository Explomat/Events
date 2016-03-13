import React from 'react';
import SelectedItems from './SelectedItems';
import Items from './Items';
import Filters from './Filters';
import Ajax from '../../../../utils/Ajax';

import './style/select-items.scss';

var items = {
	headerCols: [{ name: 'a', type: 'string' }],
	items: [
		{ id: '1', data: {fullname: 'Матвеев Савва Янович'} },
		{ id: '2', data: {fullname: 'Габдуллин Дамир Габдульбариевич'} }
	]
}

class SelectItems extends React.Component {
	
	constructor(props){
		super(props);
		this.onSort = this.onSort.bind(this);
		this.onAddItem = this.onAddItem.bind(this);
		this.onRemoveItem = this.onRemoveItem.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);
	} 

	static childContextTypes = {
		onSort: React.PropTypes.func,
		onAddItem: React.PropTypes.func,
		onRemoveItem: React.PropTypes.func
	}

    getChildContext(){
    	return {
    		onSort: this.onSort,
    		onAddItem: this.onAddItem,
    		onRemoveItem: this.onRemoveItem
    	};
  	}

	static propTypes = {
		items: React.PropTypes.array,
		selectedItems: React.PropTypes.array,
		query: React.PropTypes.string,
		title: React.PropTypes.string,
		onClose: React.PropTypes.func
	}

	types: {'integer': 'integer', 'date': 'date'}

	state = {
		headerCols: this.props.headerCols || [],
		items: this.props.items || [],
		selectedItems: this.props.selectedItems || [],
		search: '',
		page: 1
	}

	static defaultProps = {
		title: ''
	}

	componentDidMount(){
		var self = this;
		var _items = this._filterItems(items.items, this.state.selectedItems);
		this.setState({items: _items});
		/*this._getItems(this.props.query, this.state.page, this.state.search).then(data => {
			data.items = data.items.map(item => {
				Object.keys(item.data).forEach((col, index) => {
					self._castType(item.data[col], data.headerCols[index].type);
				})
				return {
					id: item.id,
					data: item.data
				}
			});
			data.items = this._filterItems(data.items, this.state.selectedItems);
			this.setState({items: data.items, headerCols: data.headerCols})
		});*/
	}

	_castType(val, type){

		function isInteger(val) {
			return isNaN(parseInt(val)) === false;
		}

		function isDate(val){
			return Date.parse(val) !== isNaN(val);
		}

		if (val === undefined || val === null || !(type in this.types)) return val.toString();
		switch(type) {
			case this.types.integer:
				if (isInteger(val))
					return Number(val);
			case this.types.date:
				if (isDate(val))
					return new Date(val);
			default:
				return val.toString();
		}
	}

	_filterItems(items, selectedItems) {
		if (selectedItems.length === 0) return items;

		function isContains(items, item) {
			for (var i = items.length - 1; i >= 0; i--) {
				if (items[i].id === item.id) return true;
			};
			return false;
		}

		return items.filter((i, index) => {
			return !isContains(selectedItems, i);
		});
	}

	_getItems(query, page, search){
		return Ajax.sendRequest(query + '&page=' + page + '&search=' + search).then(_items => {
			return JSON.parse(_items);
		}).catch(function(err){
			return [];
		});
	}

	_setItems(){

	}

	onSort(index, isAscending){
		function getFieldByIndex(data, index){
			return Object.keys(data).filter((key, _index) => {
				return index === _index;
			});
		}

		var isAsc = isAscending ? 1 : -1;
		var items = this.state.items;
		items.sort((first, second) => {
			var firstField = getFieldByIndex(first.data, index);
			var secondFiled = getFieldByIndex(second.data, index);
			return firstField > secondFiled ? isAsc : firstField === secondFiled ? 0 : -(isAsc);
		});
		this.setState({items: items});
	}

	onAddItem(id, data){
		var _items = this.state.items;
		var _selectedItems = this.state.selectedItems;
		_selectedItems = _selectedItems.concat([{ id: id, data: data }]);

		_items = _items.filter(item => {
			return item.id !== id;
		});
		this.setState({ items: _items, selectedItems: _selectedItems});
	}

	onRemoveItem(id, data){
		var _items = this.state.items;
		var _selectedItems = this.state.selectedItems;
		_items.push({ id: id, data: data });

		_selectedItems = selectedItems.filter(r => {
			return r.id !== id;
		});
		this.setState({ items: _items, selectedItems: _selectedItems});
	}

	handleClose(){
		if (this.props.onClose){
			this.props.onClose();
		}
	}

	handleSave(){
		if (this.props.onSave){
			this.props.onSave(this.state.selectedItems);
		}
	}

	handleChangeSearch(){

	}

	handleChangePage(){

	}

	render() {
		return (
			<div className="select-items" style={{display: "block"}}>
				<div className="select-items__modal-box">
					<div className="select-items__content">
						<div className="select-item__header">
							<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
							<span>{this.props.title}</span>
						</div>
						<div className="select-item__body clearfix">
							<Filters 
								page={this.state.page} 
								search={this.state.search} 
								onSearch={this.handleChangeSearch}
								onPage={this.handleChangePage}/>
							<Items items={this.state.items} headerCols={this.state.headerCols}/>
							<SelectedItems items = {this.state.selectedItems} />
						</div>
						<div className="select-item__footer">
							<button type="button" className="event-btn event-btn--reverse" onClick={this.handleSave}>Сохранить</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
};
export default SelectItems;