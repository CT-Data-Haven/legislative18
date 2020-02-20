import React from 'react';

const VizContainer = (props) => {
  return (
    <div className='VizContainer'>
      <div>container</div>
      { props.children }
    </div>
  );
};

export default VizContainer;
