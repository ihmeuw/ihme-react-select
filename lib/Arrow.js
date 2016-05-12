"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Arrow = _react2["default"].createClass({
  displayName: "Arrow",

  propTypes: {
    handleMouseDownOnArrow: _react2["default"].PropTypes.func // method to handle mouseLeave on option element
  },

  render: function render() {
    return _react2["default"].createElement(
      "span",
      { className: "Select-arrow-zone", onMouseDown: this.props.handleMouseDownOnArrow },
      _react2["default"].createElement("span", { className: "Select-arrow", onMouseDown: this.props.handleMouseDownOnArrow })
    );
  }
});

module.exports = Arrow;