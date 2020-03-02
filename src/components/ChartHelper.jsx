import React from 'react';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';

const ChartHelper = () => (
  <div className='ChartHelper float-right'>
    <OverlayTrigger trigger='click' placement='bottom' overlay={ popover }>
      <Button variant='outline-info' size='sm'>About</Button>
    </OverlayTrigger>
  </div>
);

const popover = (
  <Popover id='chart-help-popover'>
    <Popover.Title as='h4'>About this chart</Popover.Title>
    <Popover.Content>This chart shows the range of values throughout the state. Each dot represents one district. More common values will have many dots clustered around them, while less common ones have few dots.</Popover.Content>
  </Popover>
);

export default ChartHelper;
