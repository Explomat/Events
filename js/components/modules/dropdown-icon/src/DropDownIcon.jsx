import React from 'react';
import cx from 'classnames';
import listensToClickOutside from 'react-onclickoutside';
import './style/dropdown-icon.scss';

export class DropDownIconItem extends React.Component {

	static propTypes = {
		payload: React.PropTypes.string,
		text: React.PropTypes.string
	}

	static contextTypes = {
		onToggle: React.PropTypes.func
	}

	handleClick(e) {
		if (this.context.onToggle){
			this.context.onToggle();
		}
		if (this.props.onClick)
			this.props.onClick(e, this.props.payload, this.props.text);
	}

	render() {
		const {text} = this.props;
		return (
			<li className="dropdown-icon__item" onClick={::this.handleClick}>
				<span>{text}</span>
			</li>
		);
	}
};

class _DropDownIcon extends React.Component {

	constructor(props){
		super(props);

		this.isRightBoundOverflow = false; //заезжает ли за правую границу экрана
	}

	static propTypes = {
		//icons: React.PropTypes.array, //Количество такое же как и items. Payload должен совпадать с payload item. [ payload: 1, iconClass: icon-class ]
		icon: React.PropTypes.any,
		className: React.PropTypes.string,
		classNameList: React.PropTypes.string
	}

	static childContextTypes = {
		onToggle: React.PropTypes.func
	}

	static defaultProps = {
		children: []
	}

	state = {
		display: false
	}

	getChildContext(){
    	return {
    		onToggle: ::this.handleToggleDisplay
    	};
  	}

  	componentDidMount(){
  		this.isRightBoundOverflow = this._isRightBoundOverflow();
  	}

  	_isRightBoundOverflow(){
  		let listContainer = this.refs.listContainer; 
  		let list = this.refs.list;

  		let listContainerLeftBound = listContainer.getBoundingClientRect().left;
  		const listWidth = list.offsetWidth;
  		const windowWidth = window.innerWidth;
  		return listContainerLeftBound + listWidth >= windowWidth;
  	}

  	_isChildren(children){
  		return Array.isArray(children) ? children.length > 0 : (children !== null || children !== undefined);
  	}

	_stopPropagation(e){
		if (!e || (!e.stopPropagation && !e.nativeEvent)) return;
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();
	}

	handleClickOutside() {
		this.setState({display: false});
	}

	handleToggleDisplay(e) {
		this._stopPropagation(e);
		if (this._isChildren()) {
			this.setState({display: !this.state.display});
		}
	}

	render() {
		const className = cx('dropdown-icon', this.props.className);
		const classNameList = cx({
			'dropdown-icon__list': true,
			'dropdown-icon__list--display': this.state.display,
			'dropdown-icon__list--display-right': this.state.display && this.isRightBoundOverflow
		}, this.props.classNameList);
		const caretClassName = cx({
			'dropdown-icon__caret': true,
			'dropdown-icon__caret--display': this._isChildren(this.props.children)
		})
		return (
			<div className={className}>
				<div className="dropdown-icon__button" type="button" onClick={::this.handleToggleDisplay}>
					{this.props.icon}
					<span className={caretClassName}></span>
				</div>
				<div ref="listContainer" className="dropdown-icon__list-container">
					<ul ref="list" className={classNameList}>
						{this.props.children}
					</ul>
				</div>
			</div>
		);
	}
};

export const DropDownIcon = listensToClickOutside(_DropDownIcon);