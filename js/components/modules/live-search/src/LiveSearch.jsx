import React from 'react';
import cx from 'classnames';
import listensToClickOutside from 'react-onclickoutside/decorator';
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
	}

	static propTypes = {
		items: React.PropTypes.array, // [ {payload: 1, value: "test"} ]
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		payload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		placeholder: React.PropTypes.string,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		timeoutDelay: React.PropTypes.number
	}

	static defaultProps = {
		items: [],
		timeoutDelay: 300
	}

	state = {
		display: false
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
			if (this.props.onChange){
				this.props.onChange(this.currentValue);
			}
		}
	}

	_startSearch(value){
		this.currentValue = value;
		this.curKeyUpMilliseconds = Date.now();

		var timeoutID = window.setTimeout(::this._onSearch, this.props.timeoutDelay);
		this.timeouts.push(timeoutID);
	}

	componentWillReceiveProps(){
		this.setState({display: true});
	}

	handleClick(e){
		this._startSearch(e.target.value);
	}

	handleClickOutside(){
		this.setState({display: false});
	}

	handleKeyUp(e){
		this._startSearch(e.target.value);
	}

	handleFocus(e){
		this._startSearch(e.target.value);
	}

	handleSelect(payload, value){
		if (this.props.onSelect){
			this.props.onSelect(payload, value);
		}
	}

	render() {
		const {value, placeholder} = this.props;
		const classes = cx('live-search', this.props.className);
		const contentClasses = cx({
			'live-search__content': true,
			'live-search__content--visible': this.state.display
		});
		return (
			<div className={classes}>
				<div className="live-search__container">
					<span ref="searchBox" className="live-search__search-box">
						<input
							onClick={::this.handleClick}
							onFocus={::this.handleFocus}
							onKeyUp={::this.handleKeyUp} 
							className="live-search__input" 
							value={value} 
							placeholder={placeholder} />
					</span>
					<div className="live-search__drop">
						<div className={contentClasses}>
							{this.props.items.map((i, index) => {
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