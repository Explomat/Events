import React from 'react';

class EditEventButton extends React.Component {

	static propTypes = {
		href: React.PropTypes.string,
		className: React.PropTypes.string
	}

	static defaultProps = {
		href: '#'
	}

	render() {
		const { href, className } = this.props;
		return (
			<a href={href} className={className} title="Редактировать мероприятие">
				<i className="icon-pencil-square-o"></i>
			</a>
		);
	}
};
export default EditEventButton;