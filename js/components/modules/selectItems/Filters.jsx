var React = require('react');
var SearchBar = require('../SearchBar');
var TextBase = require('../TextLabel').TextBase;
var extend = require('extend');

var Paging = React.createClass(extend({}, TextBase, {

	propTypes: {
		value: React.PropTypes.number,
		onChange: React.PropTypes.number
	},

	getDefaultProps: function() {
		return {
			value: 1,
			isValid: function(val){
				return /^[1-9]{1,}(\d+)?$/.test(val);
			},
			notValidClass: 'filters__notValid'
		}
	},

	componentWillReceiveProps: function(nextProps){
		this.setState({value: nextProps.value});
	},

	_changePage: function(page){
		if (this.props.onChange) {
			this.props.onChange(page);
			this.setState({value: Number(page)});
		}
	},

	handleChangeDecrementPage: function(){
		if (this.state.value <= 1) return;
		this._changePage(this.state.value - 1);
	},

	handleChangeIncrementPage: function(){
		this._changePage(this.state.value + 1);
	},

	render: function(){
		return (
			<div className="filters__paging">
				<i className="fa fa-arrow-left" onClick={this.handleChangeDecrementPage}></i>
				<input type="text" className="input" value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} />
				<i className="fa fa-arrow-right" onClick={this.handleChangeIncrementPage}></i>
			</div>
		);
	}
}));

var Filters = React.createClass({

	render: function() {
		return (
			<div className="filters">
				<SearchBar value={this.props.searchValue} className={"filters__searchBar"} classNameInput={"filters__searchBar-input"}/>
				<Paging page={this.props.page} />
			</div>
		);
	}
});

module.exports = Filters;