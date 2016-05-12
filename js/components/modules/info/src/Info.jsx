import React from 'react';
import cx from 'classnames';

import './style/info.scss';

class Info extends React.Component {

    constructor(props){
        super(props);
        this.statuses = { info: 'info', error: 'error', done: 'done' };
    }

    static propTypes = {
        status: React.PropTypes.string,
        message: React.PropTypes.string,
        isShow: React.PropTypes.bool,
        onClose: React.PropTypes.func
    }

    static defaultProps = {
        isShow: false
    }

    _createMarkup(markup) { 
        return {__html: markup}; 
    }

    render() {
        if (!this.props.isShow) {
            return null;
        }

        const status = this.props.status;
        const infoIconClasses = cx({
            'info__icon': true,
            'info__icon--error': status === this.statuses.error,
            'info__icon--info': status === this.statuses.info,
            'info__icon--done': status === this.statuses.done
        });
        const iconClasses = cx({
            'icon-ban': status === this.statuses.error,
            'icon-exclamation-circle': status === this.statuses.info,
            'icon-check-circle': status === this.statuses.done
        });
        const markup = this._createMarkup(this.props.message);
        return (
            <div className="info">
                <div className="info__modal-box">
                    <div className="info__content">
                        <div className="info__body clearfix">
                            <span className={infoIconClasses}>
                                <i className={iconClasses}></i>
                            </span>
                            <div className="info__message" dangerouslySetInnerHTML={markup}></div>
                            <button onClick={this.props.onClose} className="info__button event-btn">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default Info;
