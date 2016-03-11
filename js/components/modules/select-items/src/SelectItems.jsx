var React = require('react');
var SelectedItems = require('./SelectedItems');
var Items = require('./Items');
var Filters = require('./Filters');
var Ajax = require('../../../../utils/Ajax');

require('./style/select-items.scss');

var items = {
	headerCols: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string'}, { name: 'c', type: 'integer' }],
	rows: [
		{ id: 1, cols: ['Матвеев Савва Янович', 'должность_должность', '1']},
		{ id: 2, cols: ['Габдуллин Дамир Габдульбариевич', 'Группа дистанционного обучения', '2']}
	]
}

var SelectItems = React.createClass({

	childContextTypes: {
		onSort: React.PropTypes.func,
		onAddItem: React.PropTypes.func,
		onRemoveItem: React.PropTypes.func
	},

    getChildContext(){
    	return {
    		onSort: this.onSort,
    		onAddItem: this.onAddItem,
    		onRemoveItem: this.onRemoveItem
    	};
  	},

	propTypes: {
		items: React.PropTypes.array,
		selectedItems: React.PropTypes.array,
		query: React.PropTypes.string,
		title: React.PropTypes.string,
		onClose: React.PropTypes.func
	},

	types: {'integer': 'integer', 'date': 'date'},

	getInitialState() {
		return {
			headerCols: this.props.headerCols,
			items: this.props.items,
			selectedItems: this.props.selectedItems,
			search: '',
			page: 1
		}
	},

	getDefaultProps(){
		return {
			headerCols: [],
			items: [],
			selectedItems: [],
			title: ' '
		}
	},

	componentDidMount(){
		var self = this;
		this._getItems(this.props.query, this.state.page, this.state.search).then(data => {
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
		})
	},

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
	},

	_filterItems(items, selectedItems) {
		if (selectedItems.length === 0) return items;

		function isContains(items, item) {
			for (var i = items.length - 1; i >= 0; i--) {
				if (items[i].id === item.id) return true;
			};
			return false;
		}

		return items.filter(function(i, index){
			return !isContains(selectedItems, i);
		});
	},

	_getItems(query, page, search){
		return Ajax.sendRequest(query + '&page=' + page + '&search=' + search).then(function(_items){
			return JSON.parse(_items);
		}).catch(function(err){
			return [];
		});
	},

	onSort(index, isAscending){
		function getFieldByIndex(data, index){
			return Object.keys(data).filter(function(key, _index){
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
	},

	onAddItem(id, data){
		var items = this.state.items;
		var selectedItems = this.state.selectedItems;
		selectedItems.push({ id: id, data: data });

		items = items.filter(item => {
			return item.id !== id;
		});
		this.setState({ items: items, selectedItems: selectedItems});
	},

	onRemoveItem(id, data){
		var items = this.state.items;
		var selectedItems = this.state.selectedItems;
		items.push({ id: id, data: data });

		selectedItems = selectedItems.filter(r => {
			return r.id !== id;
		});
		this.setState({ items: items, selectedItems: selectedItems});
	},

	handleClose(){
		if (this.props.onClose){
			this.props.onClose();
		}
	},

	handleSave(){
		if (this.props.onSave){
			this.props.onSave(this.state.selectedItems);
		}
	},

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
							<Filters page={this.state.page} search={this.state.search}/>
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
});

module.exports = SelectItems;