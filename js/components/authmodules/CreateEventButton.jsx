import React from 'react';
import cx from 'classnames';

class CreateEventButton extends React.Component {

	static propTypes = {
		href: React.PropTypes.string,
		className: React.PropTypes.string
	}

	static defaultProps = {
		href: '#'
	}

	render() {
		const { href, className } = this.props;
		const classes = cx({
			'event-btn': true,
			'event-btn--reverse': true
		}, className);
		return (
			<a href={href} className={classes} title="Создать мероприятие">
				<i className="icon-plus"></i>
			</a>
		);
	}
};
export default CreateEventButton;