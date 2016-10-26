import React from 'react';
import cx from 'classnames';

class ReasonMissEventButton extends React.Component {

	static displayName = 'ReasonMissEventButton'

	static propTypes = {
		onMouseUp: React.PropTypes.func,
		className: React.PropTypes.string
	}

	static defaultProps = {
		href: '#'
	}

	handleClick(e){
		e.preventDefault();
	}

	render() {
		const { href, className } = this.props;
		const classes = cx('event-btn', 'event-btn--reverse', 'calendar-table__reason-miss-event', className);
		return (
			<a href={href} className={classes} title="Указать причину">
				<i className="calendar-table__reason-icon"></i>
				<span>?</span>
			</a>
		);
	}
};
export default ReasonMissEventButton;