import React from 'react';

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
	state = {
		isRotate: false
	}

	static defaultProps = {
		name: ''
	}

	handleSort(){
		if (this.context.onSort) {
			this.context.onSort(this.props.index, this.state.isRotate);
			this.setState({isRotate: !this.state.isRotate});
		}
	}

	render(){
		var caretClassName = this.state.isRotate ? "rotate" : "";
		return(
			<th onClick={this.handleSort}>
				<span className="header-row__col-name">{this.props.name}</span>
				<span className={"caret " + caretClassName}></span>
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
		data: React.PropTypes.object
	}

	static defaultProps = {
		data: {}
	}

	handleAddItem(){
		if (this.context.onAddItem){
			this.context.onAddItem(this.props.id, this.props.data);
		}
	}

	getMarkup(){
		var data = this.props.data;
		return (
			<tr className="body-row">
				<td>
					<button onClick={this.handleAddItem}>+</button>
				</td>
				{Object.keys(data).map((c, index) => {
					return <td key={index} className="body-row__col">{data[c]}</td>
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
		headerCols: React.PropTypes.array.isRequired,
		items: React.PropTypes.array.isRequired
	}

	getColsMarkup(){
		var headerCols = this.props.headerCols;
		var markUpCols = [<th key={0}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>];
		headerCols.forEach((c, index) => {
			markUpCols.push(<HeaderCol key={index + 1} name={c.name} index={index}/>);
		});
		return markUpCols;
	}

	getRowsMarkUp(){
		var items = this.props.items;
		return items.map((r, index) => {
			return <Item key={index} id={r.id} data={r.data} />
		});
	}

	render() {
		var cols = this.getColsMarkup();
		var items = this.getRowsMarkUp();
		return(
			<table className="items">
				<thead className="items__header">
					<tr className="header-row">{cols}</tr>
				</thead>
				<tbody className="items__body">
					{items}
				</tbody>
			</table>
		);
	}
};

export default Items;