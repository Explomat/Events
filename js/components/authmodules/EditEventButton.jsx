import React from 'react';

class EditEventButton extends React.Component {

	static displayName = 'EditEventButton'

	static propTypes = {
		onMouseUp: React.PropTypes.func,
		className: React.PropTypes.string
	}

	handleClick(e){
		e.preventDefault();
	}

	render() {
		const { onMouseUp, className } = this.props;
		return (
			<a onMouseUp={onMouseUp} onClick={this.handleClick} href='#' className={className} title="Редактировать мероприятие">
				<i className="icon-pencil-square-o"></i>
			</a>
		);
	}
};
export default EditEventButton;