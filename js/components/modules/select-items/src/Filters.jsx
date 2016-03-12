var React = require('react');
var SearchBar = require('../../search-bar/index');
var TextBase = require('../../text-label/index').TextBase;
var extend = require('extend');

var Paging = React.createClass(extend({}, TextBase, {

	propTypes: {
		value: React.PropTypes.number,
		onChange: React.PropTypes.number
	},

	getDefaultProps() {
		return {
			value: 1,
			isValid(val){
				return /^[1-9]{1,}(\d+)?$/.test(val);
			},
			notValidClass: 'filters__notValid'
		}
	},

	componentWillReceiveProps(nextProps){
		this.setState({value: nextProps.value});
	},

	_changePage(page){
		if (this.props.onChange) {
			this.props.onChange(page);
			this.setState({value: Number(page)});
		}
	},

	handleChangeDecrementPage(){
		if (this.state.value <= 1) return;
		this._changePage(this.state.value - 1);
	},

	handleChangeIncrementPage(){
		this._changePage(this.state.value + 1);
	},

	render(){
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

	render() {
		return (
			<div className="filters">
				<SearchBar onSearch={this.props.onSearch} value={this.props.search} className={"filters__searchBar"} classNameInput={"filters__searchBar-input"}/>
				<Paging onChange={this.props.onChange} page={this.props.page} />
			</div>
		);
	}
});

module.exports = Filters;