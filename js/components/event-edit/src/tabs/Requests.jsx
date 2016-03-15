import React from 'react';

class Requests extends React.Component {

	render(){
		return (
			<div>
				<CheckBox label={"Автоматически включать в состав участников"} />
				<CheckBox label={"Необходимо подтверждение от непосредственного руководителя"} />
				<CheckBox label={"Необходимо подтверждение от ответственного за мероприятие"} />
			</div>
		);
	}
};

export default Requests;