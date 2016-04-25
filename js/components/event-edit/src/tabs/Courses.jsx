import React from 'react';
import LiveSearch from 'components/modules/live-search';
import '../style/event-edit-courses.scss';


class Courses extends React.Component {

	render(){
		return (
			<div className="event-edit-courses">
				<LiveSearch items={this.props.items} />
			</div>
		);
	}
};

export default Courses;