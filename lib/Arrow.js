"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var propTypes = {
  onMouseDown: _react.PropTypes.func // method to handle mouseLeave on option element
};

var Arrow = function Arrow(props) {
  return _react2["default"].createElement(
    "span",
    { className: "Select-arrow-zone", onMouseDown: props.onMouseDown },
    _react2["default"].createElement("span", { className: "Select-arrow", onMouseDown: props.onMouseDown })
  );
};

Arrow.propTypes = propTypes;

exports["default"] = Arrow;
module.exports = exports["default"];