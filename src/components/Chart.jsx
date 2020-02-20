import React from 'react';
import { ResponsiveOrdinalFrame } from 'semiotic';
import { fmt, getExtent } from './utils';

import '../styles/Chart.css';

const Chart = (props) => {

  return (
    <div className='Chart'>
      { props.meta.map((d, i) =>  (
        <Facet
          key={ `chart-${ d.indicator }` }
          data={props.data}
          display={ d.display }
          oAccessor='none'
          rAccessor={ d.indicator }
          rExtent={ getExtent(props.data, d.indicator) }
          style={ (d) => props.scales(d) }
          // format={ props.meta.format ? fmt(props.meta.format) : (d) => d }
          title={ d.display }
        />
      )
      ) }
    </div>
  );
};

const Facet = (props) => (
  <div className='Facet'>
    <h4 className='facet-heading'>{ props.display }</h4>
    <ResponsiveOrdinalFrame
      { ...props }
      axes={
        [{ orient: 'bottom', baseline: 'under', ticks: 4, tickFormat: props.format }]
      }
      size={ [500, 150] }
      type={{
        type: 'swarm',
        r: 5,
        strength: 1
      }}
      margin={{ top: 5, right: 10, bottom: 40, left: 10 }}
      projection='horizontal'
      responsiveWidth={ true }
    />
  </div>
);

export default Chart;
