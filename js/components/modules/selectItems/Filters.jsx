var React = require('react');
var SearchBar = require('../SearchBar');

var Filters = React.createClass({

	render: function() {
		return (
			<div className="filters">
				<SearchBar value={this.props.searchValue} />
			</div>
		);
	}
});

module.exports = Filters;