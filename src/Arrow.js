import React from 'react';

const Arrow = React.createClass({
  propTypes: {
    handleMouseDownOnArrow: React.PropTypes.func // method to handle mouseLeave on option element
  },

  render () {
    return (
      <span className="Select-arrow-zone" onMouseDown={this.props.handleMouseDownOnArrow}>
				<span className="Select-arrow" onMouseDown={this.props.handleMouseDownOnArrow} />
			</span>
    );
  }
});

module.exports = Arrow;
