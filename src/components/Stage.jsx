import React from 'react';
import { Card } from 'react-bootstrap';
import classNames from 'classnames';
import { compileHeader, makeTitle, stripZeroes } from './utils';

import '../styles/Stage.css';

const Stage = (props) => {
  const stageClasses = classNames({
    Stage: true,
    TableStage: props.type === 'profile' || props.type === 'table',
    ProfileStage: props.type === 'profile',
    ChartStage: props.type === 'chart'
  });

  const hdr = compileHeader(props.type)({
    ...props,
    chamber: makeTitle(props.chamber),
    location: stripZeroes(props.location)
  });
  return (
    <div className={ stageClasses }>
      <Card>
        <Card.Header as='h3'>
          { hdr }
        </Card.Header>
        <Card.Body>
          { props.children }
        </Card.Body>
      </Card>
    </div>
  )
};

export default Stage;
