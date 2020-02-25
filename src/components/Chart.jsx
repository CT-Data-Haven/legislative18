import React from 'react';
import { ResponsiveOrdinalFrame } from 'semiotic';
import { fmt, getExtent, makeTooltip, makeAvgAnnotation } from './utils';
import ChartHelper from './ChartHelper';
// import '../styles/Chart.css';

const Chart = (props) => {
  return (
    <div className='Chart'>
      <ChartHelper />
      { props.meta.map((m, i) =>  (
        <Facet
          key={ `chart-${ i }` }
          data={ props.data.district }
          display={ m.display }
          oAccessor={ 'none' }
          rAccessor={ m.indicator }
          rExtent={ getExtent(props.data.district, m.indicator) }
          style={ (e) => (props.scales(e, props.district)) }
          format={ m.format ? fmt(m.format) : (e) => e }
          title={ m.display }
          customClickBehavior={ props.onClick }
          tooltipContent={ (d) => (
            <div className='custom-tip tooltip-content'>{ makeTooltip(d.location, d.value, m.format) }</div>
          )}
          ctAnnotation={ makeAvgAnnotation(props.data.state[m.indicator], m.format) }
        />
      )
      ) }
    </div>
  );
};

const Facet = ({ display, format, ctAnnotation, ...rest }) => (
  <div className='Facet'>
    <h4 className='facet-heading'>{ display }</h4>
    <ResponsiveOrdinalFrame
      { ...rest }
      axes={
        [{ orient: 'bottom', baseline: 'under', ticks: 4, tickFormat: format }]
      }
      size={ [500, 160] }
      type={{
        type: 'swarm',
        r: 5,
        strength: 1,
        iteration: 40
      }}
      // renderKey={ (d) => +d.location.substring(1) }
      margin={{ top: 5, right: 10, bottom: 40, left: 10 }}
      projection='horizontal'
      responsiveWidth={ true }
      pieceHoverAnnotation={ [{
        type: 'highlight',
        style: {
          opacity: 1.0,
          stroke: '#444'
        }
      }, {
        type: 'frame-hover'
      }] }
      pieceIDAccessor='location'
      annotations={ [ ctAnnotation ] }
    />
  </div>
);

export default Chart;
