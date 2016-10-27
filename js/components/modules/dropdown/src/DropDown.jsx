import React from 'react';
import cx from 'classnames';
import './style/dropdown.scss';

class ItemReset extends React.Component {

	handleReset(e) {
		if (this.props.onReset)
			this.props.onReset(e);
	}

	render(){
		return (
			<li onClick={::this.handleReset} className="dropdown-list__item dropdown-list__item--reset">
				<span>Сбросить</span>
				<span className="reset">&times;</span>
			</li>
		);
	}
};

class Item extends React.Component {

	handleChange(e) {
		if (this.props.onChange)
			this.props.onChange(e, this.props.payload, this.props.text, this.props.index);
	}

	render() {
		const classes = cx({
			'dropdown-list__item': true,
			'dropdown-list__item--selected': this.props.selected
		});
		return (
			<li className={classes} onClick={::this.handleChange}>
				<span>{this.props.text}</span>
			</li>
		);
	}
};

class DropDown extends React.Component {

	static propTypes = {
		items: React.PropTypes.array.isRequired, //[{ payload: 1, text: 'Test' },{...}]
		//icons: React.PropTypes.array, //Количество такое же как и items. Payload должен совпадать с payload item. [ payload: 1, iconClass: icon-class ]
		onChange: React.PropTypes.func,
		deviders: React.PropTypes.array, //указать индексы элементов после которых вставлять разделители
		selectedPayload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		className: React.PropTypes.string,
		classNameChild: React.PropTypes.string,
		classNameButton: React.PropTypes.string,
		isReset: React.PropTypes.bool
	}

	static defaultProps = {
		items: [],
		deviders: [],
		isReset: false
	}

	state = {
		display: false
	}

	_getSelectedItemText(items, payload){
		if (!payload && this.props.description) return this.props.description;
		if (!payload && Array.isArray(items) && items.length > 0) return items[0].text;
		for (var i = items.length - 1; i >= 0; i--) {
			if (items[i].payload.toString() === payload.toString())
				return items[i].text;
		}
		return null;
	}

	_stopPropagation(e){
		if (!e || (!e.stopPropagation && !e.nativeEvent)) return;
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();
	}

	_unmountComponent(){
		document.removeEventListener('click', ::this.handleBlur);
	}

	componentWillUnmount() {
		this._unmountComponent();
	}

	componentDidMount() {
		document.addEventListener('click', ::this.handleBlur, true);
	}

	handleChange(e, payload, text, index) {
		if (this.props.onChange && this.props.selectedPayload !== payload) {
			this.props.onChange(e, payload, text, index);
		}
	}

	handleBlur() {
		if (this.state.display){
			this.setState({display: false});
		}
	}

	handleToggleDisplay(e) {
		this._stopPropagation(e);
		this.setState({display: !this.state.display});
	}

	getList(){
		var list = [];
		if (this.props.isReset && this.props.selectedPayload){ 
			list.push(<ItemReset key={"ItemReject"} onReset={::this.handleChange}/>);
		}

		this.props.items.forEach((item, index) => {
			if (index !== 0 && this.props.deviders.indexOf(index) !== -1){
				list.push(<li key={"divider"+ index + 1} className="dropdown-list__devider"></li>);
			}
			var selected = this.props.selectedPayload == item.payload;
			list.push(<Item 
						key={index + 1} 
						selected={selected} 
						text={item.text} 
						payload={item.payload} 
						onChange={::this.handleChange} 
						index={index}/>);
		});
		return list;
	}

	/*getIcon: function(){
		if (!this.props.icons) return null;
		for (var i = this.props.icons.length - 1; i >= 0; i--) {
			if (this.props.icons[i].payload === selectedPayload) {
				return <span className={this.props.icons[i].iconClass}></span>
			}
		};
	},*/

	render() {
		const classes = cx('dropdown-box', this.props.className);
		const classesChild = cx({'dropdown-list': true, 'dropdown-list--display': this.state.display}, this.props.classNameChild);
		const classesButton = cx('dropdown-box__default-item', this.props.classNameButton);

		const classesTitle = cx({
			'dropdown-box__title': true,
			'dropdown-box__title--description': this.props.description && !this.props.selectedPayload
		});
		const list = this.getList();
		const selectedText = this._getSelectedItemText(this.props.items, this.props.selectedPayload);
		return (
			<div className={classes}>
				<button className={classesButton} type="button" onClick={::this.handleToggleDisplay}>
					<span className={classesTitle}>{selectedText}</span>
					<span className="dropdown-box__caret dropdown-box__caret--display"></span>
				</button>
				<ul className={classesChild}>{list}</ul>
			</div>
		);
	}
};

export default DropDown;