import React from 'react';
import SearchBar from'../../search-bar';
import {TextBase} from '../../text-label';
import extend from 'extend';

var Paging = React.createClass(extend({}, TextBase, {

	propTypes: {
		value: React.PropTypes.number,
		onChange: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			value: 1,
			pagesCount: 1,
			isValid(val){
				return /^[1-9]{1,}(\d+)?$/.test(val) && Number(val) <= this.pagesCount;
			},
			notValidClass: 'filters__notValid'
		}
	},

	componentWillReceiveProps(nextProps){
		this.setState({value: nextProps.value});
	},

	_changePage(val){
		if (this.props.onBlur){
			this.props.onBlur(val);
		}
	},

	handleChangeDecrementPage(){
		if (this.state.value <= 1) return;
		this._changePage(this.state.value - 1);
	},

	handleChangeIncrementPage(){
		if ((this.state.value + 1) > this.props.pagesCount) return;
		this._changePage(this.state.value + 1);
	},

	handleKeyDown(e){
		if (e.keyCode === 13){
			e.target.blur();
			this._changePage(e.target.value);
		}
	},

	render(){
		return (
			<div className="filters__paging">
				<i className="fa fa-arrow-left" onClick={this.handleChangeDecrementPage}></i>
				<input ref="page" type="text" className="page" value={this.state.value} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} onChange={this.handleChange}/>
				<span className="pages-count">{this.props.pagesCount}</span>
				<i className="fa fa-arrow-right" onClick={this.handleChangeIncrementPage}></i>
			</div>
		);
	}
}));

class Filters extends React.Component {
	
	static propTypes = {
		onSearch: React.PropTypes.func,
		onPage: React.PropTypes.func
	}

	render() {
		return (
			<div className="filters">
				<SearchBar onSearch={this.props.onSearch} value={this.props.search} className={"filters__searchBar"} classNameInput={"filters__searchBar-input"}/>
				<Paging onBlur={this.props.onPage} value={Number(this.props.page)} pagesCount={Number(this.props.pagesCount)}/>
			</div>
		);
	}
};
export default Filters;