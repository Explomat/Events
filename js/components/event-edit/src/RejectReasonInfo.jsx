import React from 'react';
import {TextAreaView} from 'components/modules/text-label';
import cx from 'classnames';

import './style/reject-reason-info.scss';

class RejectReasonInfo extends React.Component {

    static propsTypes = {
        rejectRequestId: React.PropTypes.string,
        rejectRequestStatus: React.PropTypes.string,
        isShow: React.PropTypes.bool,
        onReject: React.PropTypes.func,
        onClose: React.PropTypes.func
    }

    static defaultProps = {
        isShow: false
    }

    componentWillReceiveProps(){
        this.setState({reason: ''});
    }

    state = {
        reason: ''
    }

    handleReject(){
        if (this.props.onReject){
            this.props.onReject(this.props.rejectRequestId, this.props.rejectRequestStatus, this.state.reason);
        }
    }

    handleChangeReason(text){
        this.setState({reason: text});
    }

    render() {

        if (!this.props.isShow) {
            return null;
        }

        const buttonClasses = cx({
            'event-btn': true,
            'event-btn--reverse': true,
            'event-btn--disabled': this.state.reason.trim() === '',
            'reject-reason-info__button': true
        })

        return (
            <div className="reject-reason-info">
                <div className="reject-reason-info__modal-box">
                    <div className="reject-reason-info__content">
                        <div className="reject-reason-info__header">
                            <button type="button" className="close-btn" onClick={this.props.onClose}>&times;</button>
                            <span>Отклонение заявки</span>
                        </div>
                        <div className="reject-reason-info__body clearfix">
                            <TextAreaView onBlur={::this.handleChangeReason} value={this.state.reason} placeholder="Укажите причину"/>
                            <button onClick={::this.handleReject} className={buttonClasses}>Отклонить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default RejectReasonInfo;
