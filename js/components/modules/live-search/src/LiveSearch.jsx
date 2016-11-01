import React from 'react';
import cx from 'classnames';
import listensToClickOutside from 'react-onclickoutside';

import Ajax from '../../../../utils/Ajax';
import './style/live-search.scss';

class Item extends React.Component {

	handleSelect(){
		if (this.props.onSelect){
			this.props.onSelect(this.props.payload, this.props.value);
		}
	}

	render() {
		const {value, description} = this.props;
		return (
			<ul className="live-search__items" onClick={::this.handleSelect}>
				<li className="live-search__item">
					<div className="live-search__item-name">{value}</div>
					<div className="live-search__item-description">{description}</div>
				</li>
			</ul>
		);
	}
};

class LiveSearch extends React.Component {

	constructor(props){
		super(props);
		this.timeouts = [];
		this.currentValue = '';
		this.curKeyUpMilliseconds = 0;
		this.state = {
			value: props.value,
			items: [],
			display: false
		}
	}

	static propTypes = {
		query: React.PropTypes.string.isRequired,
		limit: React.PropTypes.number,
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		payload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		placeholder: React.PropTypes.string,
		className: React.PropTypes.string,
		onSelect: React.PropTypes.func,
		onChange: React.PropTypes.func,
		timeoutDelay: React.PropTypes.number
	}

	static defaultProps = {
		limit: 5,
		timeoutDelay: 300
	}

	componentWillReceiveProps(nextProps){
		this.setState({ value: nextProps.value });
	}

	_getData(query, search, limit){
		return Ajax.sendRequest(query + '&search=' + search + '&limit=' + limit).then((items) => {
			return JSON.parse(items);
		}).catch(function(){
			return [];
		});
	}

	_clearTimeouts(){
		this.timeouts.forEach((t) => {
			window.clearTimeout(t);
		});
		this.timeouts = [];
	}

	_onSearch(){
		if ((Date.now() - this.curKeyUpMilliseconds) >= this.props.timeoutDelay ) {
			this._clearTimeouts();
			this._getData(this.props.query, this.currentValue, this.props.limit).then((items) => {
				this.setState({items: items, display: true});
			});
		}
	}

	_startSearch(value){
		this.currentValue = value;
		this.curKeyUpMilliseconds = Date.now();

		this.setState({value: value});
		var timeoutID = window.setTimeout(::this._onSearch, this.props.timeoutDelay);
		this.timeouts.push(timeoutID);
	}

	handleClick(e){
		this._startSearch(e.target.value);
	}

	handleClickOutside(){
		this.setState({display: false});
	}

	handleChange(e){
		this._startSearch(e.target.value);
		if (this.props.onChange){
			this.props.onChange(this.props.payload, e.target.value);
		}
	}

	handleKeyUp(e){
		if (e.keyCode === 27) {
			this.setState({ display: false });
		}
	}

	handleFocus(e){
		this._startSearch(e.target.value);
	}

	handleSelect(payload, value){
		if (this.props.onSelect){
			this.setState({display: false});
			this.props.onSelect(payload, value);
		}
	}

	render() {
		const {placeholder} = this.props;
		const {items, display, value} = this.state;
		const classes = cx('live-search', this.props.className);
		const contentClasses = cx({
			'live-search__content': true,
			'live-search__content--visible': display
		});
		const inputClasses = cx({
			'live-search__input': true,
			'live-search__input_not-empty': this.state.value
		});
		return (
			<div className={classes}>
				<div className="live-search__container">
					<span ref="searchBox" className="live-search__search-box">
						<input
							onClick={::this.handleClick}
							onFocus={::this.handleFocus}
							onChange={::this.handleChange}
							onKeyUp={::this.handleKeyUp} 
							className={inputClasses}
							value={value}/>
						 <label className="live-search__label">{placeholder}</label>
						 <span className="icon-magnifying-glass live-search__caret"></span>
					</span>
					<div className="live-search__drop">
						<div className={contentClasses}>
							{items.map((i, index) => {
								return <Item key={index} {...i} onSelect={::this.handleSelect}/>
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default listensToClickOutside(LiveSearch);