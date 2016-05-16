import React, { PropTypes } from 'react';

const propTypes = {
  onMouseDown: PropTypes.func // method to handle mouseLeave on option element
};

const Arrow = (props) => {
  return (
    <span className="Select-arrow-zone" onMouseDown={props.onMouseDown}>
      <span className="Select-arrow" onMouseDown={props.onMouseDown} />
    </span>
  );
};

Arrow.propTypes = propTypes;

export default Arrow;
