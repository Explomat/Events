import React from 'react';

class EditEventButton extends React.Component {

	static displayName = 'EditEventButton'

	static propTypes = {
		onClick: React.PropTypes.func,
		className: React.PropTypes.string
	}

	render() {
		const { onClick, className } = this.props;
		return (
			<a onClick={onClick} href='#' className={className} title="Редактировать мероприятие">
				<i className="icon-pencil-square-o"></i>
			</a>
		);
	}
};
export default EditEventButton;