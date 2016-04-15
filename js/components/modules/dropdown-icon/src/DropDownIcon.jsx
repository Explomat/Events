import React from 'react';
import cx from 'classnames';
import listensToClickOutside from 'react-onclickoutside/decorator';
import './style/dropdown-icon.scss';

class Item extends React.Component {

	handleChange(e) {
		if (this.props.onChange)
			this.props.onChange(e, this.props.payload, this.props.text);
	}

	render() {
		const {text} = this.props;
		return (
			<li className="dropdown-icon__item" onClick={::this.handleChange}>
				<span>{text}</span>
			</li>
		);
	}
};

class DropDownIcon extends React.Component {

	static propTypes = {
		items: React.PropTypes.array.isRequired, //[{ payload: 1, text: 'Test' },{...}]
		//icons: React.PropTypes.array, //Количество такое же как и items. Payload должен совпадать с payload item. [ payload: 1, iconClass: icon-class ]
		onChange: React.PropTypes.func,
		selectedPayload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		className: React.PropTypes.string,
		classNameList: React.PropTypes.string
	}

	static defaultProps = {
		items: []
	}

	state = {
		display: false
	}

	_stopPropagation(e){
		if (!e || (!e.stopPropagation && !e.nativeEvent)) return;
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();
	}

	handleClickOutside() {
		this.setState({display: false});
	}

	handleChange(e, payload, text) {
		if (this.props.onChange && this.props.selectedPayload !== payload) {
			this.props.onChange(e, payload, text);
		}
		this.setState({display: false});
	}

	handleToggleDisplay(e) {
		this._stopPropagation(e);
		if (this.props.items.length > 0) {
			this.setState({display: !this.state.display});
		}
	}

	render() {
		const className = cx('dropdown-icon', this.props.className);
		const classNameList = cx({
			'dropdown-icon__list': true,
			'dropdown-icon__list--display': this.state.display
		}, this.props.classNameList);
		const caretClassName = cx({
			'caret': true,
			'dropdown-icon__caret': true,
			'dropdown-icon__caret--display': this.props.items.length > 0
		})
		return (
			<div className={className}>
				<div className="dropdown-icon__button default-button" type="button" onClick={::this.handleToggleDisplay}>
					{this.props.children}
					<span className={caretClassName}></span>
				</div>
				<ul className={classNameList}>
					{this.props.items.map((item, index) => {
						return <Item key={index + 1} {...item} onChange={::this.handleChange}/>
					})}
				</ul>
			</div>
		);
	}
};

export default listensToClickOutside(DropDownIcon);