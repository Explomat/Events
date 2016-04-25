import React from 'react';
import './style/search-bar.scss';

var SearchBar = React.createClass({

	propTypes: {
		value: React.PropTypes.string,
		className: React.PropTypes.string,
		classNameInput: React.PropTypes.string,
		onSearch: React.PropTypes.func
	},

	getInitialState(){
		return {
			value: this.props.value
		}
	},

	componentWillReceiveProps(nextProps){
		this.setState({value: nextProps.value});
	},

	handleChange(e){
		this.setState({value: e.target.value});
	},

	handleblur(e){
		if (this.props.onSearch && this.state.value !== this.props.value){
			this.props.onSearch(e.target.value);
		}
	},

	handleSearch(e){
		if (e.keyCode === 13 && this.props.onSearch){
			this.props.onSearch(e.target.value);
		}
	},

	render() {
		var className = this.props.className ? this.props.className : '';
		var classNameInput = this.props.classNameInput ? this.props.classNameInput : '';
		return (
			<div className={"search-box " + className}>
				<input onChange={this.handleChange} onBlur={this.handleblur} onKeyDown={this.handleSearch} className={"search-box__search-input " + classNameInput} type="text" value={this.state.value} placeholder="Поиск..." />
				<span className="search-box__search-icon icon-search"></span>
			</div>
		);
	}
});

module.exports = SearchBar;