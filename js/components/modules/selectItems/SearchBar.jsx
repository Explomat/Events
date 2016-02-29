var React = require('react');

var SearchBar = React.createClass({

	propTypes: {
		items: React.PropTypes.object,
		selectedItems: React.PropTypes.array,
		query: React.PropTypes.string,
		title: React.PropTypes.string
	},

	render: function() {
		return (
			<div className="select-item modal-box" style={{display: "block"}}>
				<div className="select-item__modal-box modal-box__dialog">
					<div className="modal-box__content">
						<div className="select-item__header modal-box__header">
							<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
							<span>{this.props.title}</span>
						</div>
						<div className="select-item__body modal-box__body clearfix">
							<Items {...this.state.items} />
							<SelectedItems items = {this.state.selectedItems} />
						</div>
						<div className="select-item__footer modal-box__footer">
							<button type="button" className="event-btn event-btn--reverse" onClick={this.handleSave}>Сохранить</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SearchBar;