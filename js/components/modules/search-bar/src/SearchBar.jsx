var React = require('react');
require('./style/search-bar.scss');

var SearchBar = React.createClass({

	propsTypes: {
		value: React.PropTypes.string,
		className: React.PropTypes.string,
		classNameInput: React.PropTypes.string,
		onSearch: React.PropTypes.func
	},

	getInitialState: function(){
		return {
			value: this.props.value
		}
	},

	componentWillReceiveProps: function(nextProps){
		this.setState({value: nextProps.value});
	},

	handleChange: function(e){
		this.setState({value: e.target.value});
	},

	handleblur: function(e){
		if (this.props.onSearch){
			this.props.onSearch(e.target.value);
		}
	},

	handleSearch: function(e){
		if (e.keyCode === 13 && this.props.onSearch){
			this.props.onSearch(e.target.value);
		}
	},

	render: function() {
		var className = this.props.className ? this.props.className : '';
		var classNameInput = this.props.classNameInput ? this.props.classNameInput : '';
		return (
			<div className={"search-box " + className}>
				<input onChange={this.handleChange} onBlur={this.handleblur} onKeyDown={this.handleSearch} className={"search-box__search-input " + classNameInput} type="text" value={this.state.value} placeholder="Поиск..." />
				<span className="search-box__search-icon fa fa-search"></span>
			</div>
		);
	}
});

module.exports = SearchBar;