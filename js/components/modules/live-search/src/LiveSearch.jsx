import React from 'react';
import cx from 'classnames';
import './style/live-search.scss';

export class Item extends React.Component {

	render() {
		const {value} = this.props;
		return (
			<ul className="live-search__items" onClick={this.handleClick}>
				<li className="live-search__item">
					<span className="live-search__item-name">{value}</span>
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
		this.prevKeyUpMilliseconds = 0;
		this.curKeyUpMilliseconds = 0;
	}

	static propTypes = {
		items: React.PropTypes.array, // [ {payload: 1, value: "test"} ]
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		payload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		placeholder: React.PropTypes.string,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		timeoutDelay: React.PropTypes.number
	}

	static defaultProps = {
		items: [],
		timeoutDelay: 1000
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
		this._clearTimeouts();
		if (this.props.onChange){
			this.props.onChange(this.currentValue);
		}

		console.log(this.curKeyUpMilliseconds,this.prevKeyUpMilliseconds,  this.curKeyUpMilliseconds - this.prevKeyUpMilliseconds);
		if ((this.curKeyUpMilliseconds - this.prevKeyUpMilliseconds) >= this.timeoutDelay ) {
			console.log(this.currentValue)
		}
		
	}

	handleSearchClick(){
		this.setState({display: true});
	}

	handleKeyUp(e){
		this.currentValue = e.target.value;
		this.prevKeyUpMilliseconds = this.curKeyUpMilliseconds;
		this.curKeyUpMilliseconds = Date.now();

		var timeoutID = window.setTimeout(::this._onSearch, this.props.timeoutDelay);
		this.timeouts.push(timeoutID);
	}

	render() {
		const {value, placeholder} = this.props;
		const contentClasses = cx({
			'live-search__content': true,
			'live-search__content--visible': this.state.display
		})
		return (
			<div className="live-search">
				<div className="live-search__container">
					<span ref="searchBox" className="live-search__search-box">
						<input 
							onClick={::this.handleSearchClick}
							onKeyUp={::this.handleKeyUp} 
							className="live-search__input" 
							value={value} 
							placeholder={placeholder} />
					</span>
					<div className="live-search__drop">
						<div className={contentClasses}>
							{this.props.items.map((i, index) => {
								return <Item key={index} {...i} />
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default LiveSearch;