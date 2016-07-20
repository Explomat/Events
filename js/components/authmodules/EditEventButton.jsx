import React from 'react';

class EditEventButton extends React.Component {

	static displayName = 'EditEventButton'

	static propTypes = {
		onMouseUp: React.PropTypes.func,
		className: React.PropTypes.string
	}

	render() {
		const { onMouseUp, className } = this.props;
		return (
			<a onMouseUp={onMouseUp} href='#' className={className} title="Редактировать мероприятие">
				<i className="icon-pencil-square-o"></i>
			</a>
		);
	}
};
export default EditEventButton;