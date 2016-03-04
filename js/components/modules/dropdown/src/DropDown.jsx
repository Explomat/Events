var React = require('react');
require('./style/dropdown.scss');

var ItemDescription = React.createClass({
	render: function() {
		return (
			<li className="dropdown-list__item dropdown-list__item_description">
				<span>{this.props.text}</span>
			</li>
		);
	}
});

var Item = React.createClass({

	handleChange: function(e) {
		if (this.props.onChange)
			this.props.onChange(e, this.props.payload, this.props.text, this.props.index);
	},

	render: function() {
		var classNameItem = this.props.selected ? "dropdown-list__item_selected": "";
		return (
			<li className={"dropdown-list__item " + classNameItem} onClick={this.handleChange}>
				<span>{this.props.text}</span>
			</li>
		);
	}
});

var DropDown = {

	propTypes: {
		items: React.PropTypes.array.isRequired, //[{ payload: 1, text: 'Test' },{...}]
		//icons: React.PropTypes.array, //Количество такое же как и items. Payload должен совпадать с payload item. [ payload: 1, iconClass: icon-class ]
		onChange: React.PropTypes.func,
		deviders: React.PropTypes.array, //указать индексы элементов после которых вставлять разделители
		selectedPayload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		className: React.PropTypes.string,
		classNameChild: React.PropTypes.string,
		classNameButton: React.PropTypes.string
	},

	getDefaultProps: function(){
		return {
			items: [],
			deviders: []
		}
	},

	getInitialState: function() {
		return {
			display: false
		}
	},

	_getSelectedItemText: function(items, payload){
		if (!payload && Array.isArray(items) && items.length > 0) return items[0].text;
		for (var i = items.length - 1; i >= 0; i--) {
			if (items[i].payload.toString() === payload.toString())
				return items[i].text;
		};
		return '';
	},

	_stopPropagation: function(e){
		if (!e || (!e.stopPropagation && !e.nativeEvent)) return;
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();
	},

	_unmountComponent: function(){
		document.removeEventListener('click', this.handleBlur);
	},	

	componentWillUnmount: function() {
		this._unmountComponent();
	},

	componentDidMount: function() {
		document.addEventListener('click', this.handleBlur, true);
	},

	handleChange: function(e, payload, text, index) {
		if (this.props.onChange && this.props.selectedPayload !== payload) {
			this.props.onChange(e, payload, text, index);
		}
	},

	handleBlur: function() {
		if (this.state.display)
			this.setState({display: false});
	},

	handleToogelDisplay: function(e) {
		this._stopPropagation(e);
		this.setState({display: !this.state.display});
	},

	getList: function(){
		var list = [];
		if (this.props.description && !this.props.selectedPayload) {
			list.push(<ItemDescription key={0} text={this.props.description} />);
		}
		this.props.items.forEach(function(item, index){
			if (index !== 0 && this.props.deviders.indexOf(index) !== -1){
				list.push(<li key={"divider"+ index + 1} className="dropdown-list__devider"></li>);
			}
			var selected = this.props.selectedPayload.toString() === item.payload.toString() ? true : false;
			list.push(<Item key={index + 1} selected={selected} text={item.text} payload={item.payload} onChange={this.handleChange} index={index}/>);
		}.bind(this));
		return list;
	},

	/*getIcon: function(){
		if (!this.props.icons) return null;
		for (var i = this.props.icons.length - 1; i >= 0; i--) {
			if (this.props.icons[i].payload === selectedPayload) {
				return <span className={this.props.icons[i].iconClass}></span>
			}
		};
	},*/

	render: function() {
		var className = this.props.className ? this.props.className : '';
		var classNameChild = this.props.classNameChild ? this.props.classNameChild : '';
		var classNameButton = this.props.classNameButton ? this.props.classNameButton : '';
		var isTypeDisplayStyle = { display: this.state.display ? "block" : "none" };
		var list = this.getList();
		return (
			<div className={"dropdown-box " + className}>
				<button className={"dropdown-box__default-item " + classNameButton} type="button" onClick={this.handleToogelDisplay}>
					<span className="dropdown-box__title">{this._getSelectedItemText(this.props.items, this.props.selectedPayload)}</span>
					<span className="dropdown-box__caret caret"></span>
				</button>
				<ul className={"dropdown-list " + classNameChild} style={isTypeDisplayStyle}>{list}</ul>
			</div>
		);
	}
};

module.exports = React.createClass(DropDown);
module.exports.Class = DropDown;