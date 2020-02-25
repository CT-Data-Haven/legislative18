import React from 'react';
import { LegendThreshold } from '@vx/legend';
import { fmt } from './utils.js';

import '../styles/Legend.css';

const Legend = (props) => {
  return (
    <div className='Legend'>
      <LegendThreshold
        scale={ props.colorscale }
        labelFormat={ (label) => label ? fmt(props.meta.format)(label) : '' }
      />
    </div>
  );
};

export default Legend;
