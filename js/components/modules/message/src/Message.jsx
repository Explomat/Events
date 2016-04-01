import React from 'react';

import './style/message.scss';

class Message extends React.Component {

    constructor(props){
        super(props);
    }

    static propsTypes = {
        onSend: React.PropTypes.func,
        isShow: React.PropTypes.bool,
        title: React.PropTypes.string
    }

    static defaultProps = {
        isShow: false,
        title: ' '
    }

    handleSend(){
        if (this.props.onSend)
            this.props.onSend();
    }

    render() {
        if (!this.props.isShow) {
            return null;
        }
        return (
            <div className="message">
                <div className="message__modal-box">
                    <div className="message__content">
                        <div className="message__header">
                            <button type="button" className="close-btn" onClick={this.props.onClose}>&times;</button>
                            <span>{this.props.title}</span>
                        </div>
                        <div className="message__body clearfix">
                        </div>
                        <div className="message__footer">
                            <button type="button" className="event-btn event-btn--reverse" onClick={::this.handleSend}>Отправить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default Message;
