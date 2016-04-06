import React from 'react';
import cx from 'classnames';

import './style/info.scss';

class Info extends React.Component {

    constructor(props){
        super(props);
        this.statuses = { info: 'info', error: 'error', done: 'done' };
    }

    static propsTypes = {
        status: React.PropTypes.string,
        message: React.PropTypes.string,
        isShow: React.PropTypes.bool,
        onClose: React.PropTypes.func
    }

    static defaultProps = {
        isShow: false
    }

    render() {
        if (!this.props.isShow) {
            return null;
        }

        let status = this.props.status;
        let infoIconClasses = cx({
            'info__icon': true,
            'info__icon--error': status === this.statuses.error,
            'info__icon--info': status === this.statuses.info,
            'info__icon--done': status === this.statuses.done
        });
        let iconClasses = cx({
            'fa': true,
            'fa-ban': status === this.statuses.error,
            'fa-exclamation-circle': status === this.statuses.info,
            'fa-check-circle': status === this.statuses.done
        });
        return (
            <div className="info">
                <div className="info__modal-box">
                    <div className="info__content">
                        <div className="info__body clearfix">
                            <span className={infoIconClasses}>
                                <i className={iconClasses}></i>
                            </span>
                            <div className="info__message">{this.props.message}</div>
                            <button onClick={this.props.onClose} className="info__button event-btn">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default Info;
