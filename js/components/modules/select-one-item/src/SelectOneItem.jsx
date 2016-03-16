import React from 'react';
import SelectItems from '../../select-items';
import {TextBase} from '../../text-label';
import cx from 'classnames';
import {merge} from 'lodash';
import './style/select-one-item.scss';

class SelectOneItem extends React.Component {

	constructor(props){
		super(props);
		this.handleChange = TextBase.handleChange.bind(this);
		this.handleBlur = TextBase.handleBlur.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	static propTypes = merge(TextBase.propTypes, {
		title: React.PropTypes.string,
		query: React.PropTypes.string,
		onChange: React.PropTypes.func,
		selectedItem: React.PropTypes.object
	});

	static defaultProps = TextBase.getDefaultProps.call(this);

	state = merge(TextBase.getInitialState.call(this), {isShowModal: false, selectedItem: this.props.selectedItem});

	componentDidMount = TextBase.componentDidMount.call(this);

	componentWillReceiveProps(nextProps){
		this.setState({selectedItem: nextProps.selectedItem});
	}

	getModal(){
		let selectedItem = this.state.selectedItem ? [this.state.selectedItem] : null;
		return this.state.isShowModal ? 
			<SelectItems
				title={this.props.title}
				selectedItems={selectedItem}
				maxSelectedItems={1}
				query={this.props.query}
				onClose={this.handleCloseModal} 
				onSave={this.handleSave}/> : null;
	}

	handleSave(items) {
		if (items.length === 0){
			this.setState({value: '', selectedItem: null});
			if (this.props.onChange){
				this.props.onChange(null);
			}
		}
		else if (items.length === 1){
			let item = items[0];
			let firstValue = item.data[Object.keys(item.data)[0]];
			this.setState({value: firstValue, selectedItem: item});
			if (this.props.onChange){
				this.props.onChange(item);
			}
		}
		this.handleCloseModal();
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleShowModal(){
		this.setState({isShowModal: true});
	}

	render() {
		let inputClasses = cx({
			'select-one-item__input': true,
			'select-one-item__input_not-empty': this.state.value !== '',
			[this.validClass]: !this.props.isValid(this.state.value)
		});
		let iconClasses = cx({
			'fa fa-plus-circle': !this.state.selectedItem,
			'fa fa-minus-circle': this.state.selectedItem,
			'select-one-item__icon': true,
			'select-one-item__icon--up': this.state.value !== ''
		});
		return (
			<div className={cx('select-one-item', this.props.className)} tabIndex={1} onBlur={this.handleDetranslate}>
				<input
					readOnly 
					className={inputClasses} 
					type="text" 
					value={this.state.value}
					onClick={this.handleShowModal} 
					onChange={this.handleChange}/>
                <label onClick={this.handleAddtranslate} className="select-one-item__label">{this.props.placeholder}</label>
                <i className={iconClasses}></i>
                {this.getModal()}
			</div>
		);
	}
};

export default SelectOneItem;