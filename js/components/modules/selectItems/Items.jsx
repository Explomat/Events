var React = require('react');

var HeaderCol = React.createClass({

	contextTypes: {
		onSort: React.PropTypes.func
	},

	propTypes: {
		name: React.PropTypes.string,
		type: React.PropTypes.string,
		onSort: React.PropTypes.func
	},

	getInitialState: function(){
		return {
			isRotate: false
		}
	},

	getDefaultProps: function(){
		return {
			name: ''
		}
	},

	handleSort: function(){
		if (this.context.onSort) {
			this.context.onSort(this.props.index, this.state.isRotate);
			this.setState({isRotate: !this.state.isRotate});
		}
	},

	render: function(){
		var caretClassName = this.state.isRotate ? "rotate" : "";
		return(
			<th onClick={this.handleSort}>
				<span className="header-row__col-name">{this.props.name}</span>
				<span className={"caret " + caretClassName}></span>
			</th>
		);
	}
});

var Row = React.createClass({

	contextTypes: {
		onAddItem: React.PropTypes.func
	},

	propTypes: {
		cols: React.PropTypes.array
	},

	getDefaultProps: function(){
		return {
			cols: []
		}
	},

	handleAddItem: function(){
		if (this.context.onAddItem){
			this.context.onAddItem(this.props.id, this.props.cols);
		}
	},

	getMarkup: function(){
		var cols = this.props.cols;
		return (
			<tr className="body-row">
				<td>
					<button onClick={this.handleAddItem}>+</button>
				</td>
				{cols.map(function(c, index){
					return <td key={index} className="body-row__col">{c}</td>
				})}
			</tr>
		);
	},

	render: function(){
		return this.getMarkup();
	}
});

var Items = React.createClass({

	propTypes: {
		headerCols: React.PropTypes.array.isRequired,
		rows: React.PropTypes.array.isRequired
	},

	getColsMarkup: function(){
		var headerCols = this.props.headerCols;
		var markUpCols = [<th key={0}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>];
		headerCols.forEach(function(c, index){
			markUpCols.push(<HeaderCol key={index + 1} name={c.name} index={index}/>);
		});
		return markUpCols;
	},

	getRowsMarkUp: function(){
		var rows = this.props.rows;
		return rows.map(function(r, index){
			return <Row key={index} id={r.id} cols={r.cols} />
		});
	},

	render: function() {
		var cols = this.getColsMarkup();
		var rows = this.getRowsMarkUp();
		return(
			<table className="items">
				<thead className="items__header">
					<tr className="header-row">{cols}</tr>
				</thead>
				<tbody className="items__body">
					{rows}
				</tbody>
			</table>
		);
	}
});

module.exports = Items;