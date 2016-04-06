import React from 'react';
import {TextView, TextAreaView} from '../../text-label';
import {find, filter} from 'lodash';
import cx from 'classnames';

import './style/message.scss';

class SelectedItem extends React.Component {

    handleRemoveFromSelected(){
        if (this.props.onRemoveSelected) {
            this.props.onRemoveSelected(this.props.id);
        }
    }

    render(){
        let {fullname} = this.props;
        return (
            <div onClick={::this.handleRemoveFromSelected} className="selected-item">
                <button className="selected-item__button event-btn">
                    <i className="fa fa-minus"></i>
                </button>
                <span className="selected-item__fullname">{fullname}</span>
            </div>
        );
    }
}

class NotSelectedItem extends React.Component {

    handleRemoveFromNotSelected(){
        if (this.props.onRemoveNotSelected) {
            this.props.onRemoveNotSelected(this.props.id);
        }
    }

    render(){
        let {fullname} = this.props;
        return (
            <div onClick={::this.handleRemoveFromNotSelected} className="not-selected-item">
                <button className="not-selected-item__button event-btn">
                    <i className="fa fa-plus"></i>
                </button>
                <span className="not-selected-item__fullname">{fullname}</span>
            </div>
        );
    }
}

class Message extends React.Component {

    constructor(props){
        super(props);
    }

    static propsTypes = {
        notSelectedItems: React.PropTypes.array,
        selectedItems: React.PropTypes.array,
        onSend: React.PropTypes.func,
        isShow: React.PropTypes.bool,
        title: React.PropTypes.string
    }

    static defaultProps = {
        selectedItems: [],
        notSelectedItems: [],
        isShow: false,
        title: ' '
    }

    state = {
        subject: '',
        body: '',
        selectedItems: this.props.selectedItems,
        notSelectedItems: this.props.notSelectedItems
    }

    componentWillReceiveProps(nextProps, prevProps){
        let selectedItems = nextProps.selectedItems || prevProps.selectedItems;
        let notSelectedItems = nextProps.notSelectedItems || prevProps.notSelectedItems;
        let isShow = nextProps.isShow || prevProps.isShow;
        this.setState({
            selectedItems: selectedItems, 
            notSelectedItems: notSelectedItems, 
            isShow: isShow,
            subject: '',
            body: ''
        });
    }

    handleSend(){
        if (this.props.onSend)
            this.props.onSend(this.state.selectedItems, this.state.subject, this.state.body);
    }

    handleRemoveFromSelected(id){
        let selectedItems = this.state.selectedItems;
        let notSelectedItems = this.state.notSelectedItems;

        let item = find(selectedItems, (item) => {
            return item.id === id;
        });
        selectedItems = filter(selectedItems, (item) => {
            return item.id !== id;
        });
        if (item) {
            notSelectedItems = notSelectedItems.concat([item]);
        }
        this.setState({selectedItems: selectedItems, notSelectedItems: notSelectedItems});
    }

    handleRemoveFromNotSelected(id){
        let selectedItems = this.state.selectedItems;
        let notSelectedItems = this.state.notSelectedItems;

        let item = find(notSelectedItems, (item) => {
            return item.id === id;
        });
        notSelectedItems = filter(notSelectedItems, (item) => {
            return item.id !== id;
        });
        if (item) {
            selectedItems = selectedItems.concat([item]);
        }
        this.setState({selectedItems: selectedItems, notSelectedItems: notSelectedItems});
    }

    handleChangeSubject(subject){
        this.setState({subject: subject});
    }

    handleChangeBody(body){
        this.setState({body: body});
    }

    render() {
        if (!this.props.isShow) {
            return null;
        }
        let isButtonDisabled = this.state.subject.trim() === '' || this.state.body.trim() === '' || this.state.selectedItems.length === 0;
        let buttonClasses = cx({
            'event-btn': true,
            'event-btn--reverse': true,
            'event-btn event-btn--disabled': isButtonDisabled
        });
        let selectedItemsClasses = cx({
            'message__items-selected': true,
            'message__items-selected--hide': this.state.selectedItems.length === 0
        });
        let notSelectedItemsClasses = cx({
            'message__items-not-selected': true,
            'message__items-not-selected--hide': this.state.notSelectedItems.length === 0
        });
        return (
            <div className="message">
                <div className="message__modal-box">
                    <div className="message__content">
                        <div className="message__header">
                            <button type="button" className="close-btn" onClick={this.props.onClose}>&times;</button>
                            <span>{this.props.title}</span>
                        </div>
                        <div className="message__body clearfix">
                            <div className="message__text-wrapper">
                                <TextView 
                                    onBlur={::this.handleChangeSubject} 
                                    value={this.state.subject} 
                                    className="message__subject" 
                                    placeholder="Тема" />
                                <TextAreaView 
                                    onBlur={::this.handleChangeBody} 
                                    value={this.state.body}  
                                    placeholder="Сообщение"/>
                            </div>
                            <div className="message__items">
                                <div className={selectedItemsClasses}>
                                    <span className="message__d">Кому:</span>
                                    {this.state.selectedItems.map((item, index) => {
                                        return <SelectedItem key={index} {...item} onRemoveSelected={::this.handleRemoveFromSelected}/>
                                    })}
                                </div>
                                <div className={notSelectedItemsClasses}>
                                    <span className="message__d">Выбрать:</span>
                                    {this.state.notSelectedItems.map((item, index) => {
                                        return <NotSelectedItem key={index} {...item} onRemoveNotSelected={::this.handleRemoveFromNotSelected}/>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="message__footer">
                            <button type="button" className={buttonClasses} onClick={::this.handleSend} disabled={isButtonDisabled}>Отправить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default Message;
