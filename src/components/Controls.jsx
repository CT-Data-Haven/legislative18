import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { makeTitle } from './utils.js';

const Controls = (props) => {
  const { register } = useFormContext();
  const topics = Object.keys(props.meta);

  return (
    <div className='Controls'>
      <Form>
        <Row>
          <Col lg={ 4 } md={ 6 }>
            <Form.Group controlId='_chamber'>
              <Form.Label>Select a chamber</Form.Label>
              <Form.Control as='select' name='_chamber' className='custom-select' ref={ register } onChange={ props.onChange }>
                { props.chambers.map((d) => (
                  <option key={ `chamber-${ d }` } value={ d }>{ makeTitle(d) }</option>
                )) }
              </Form.Control>
            </Form.Group>
          </Col>

          { /* spacer */ }
          <Col lg={ 4 } md={ 6 } className='d-lg-none'></Col>

          <Col lg={ 4 } md={ 6 }>
            <Form.Group controlId='_topic'>
              <Form.Label>Select a topic</Form.Label>
              <Form.Control as='select' name='_topic' className='custom-select' ref={ register } onChange={ props.onChange }>
                { topics.map((d) => (
                  <option key={ `topic-${ d }` } value={ d }>{ props.meta[d].display }</option>
                )) }
              </Form.Control>
            </Form.Group>
          </Col>

          <Col lg={ 4 } md={ 6 }>
            <Form.Group controlId='_indicator'>
              <Form.Label>Select an indicator</Form.Label>
              <Form.Control as='select' name='_indicator' className='custom-select' ref={ register } onChange={ props.onChange } disabled={ props.viz !== 'map' }>
                { props.indicators.map((d) => (
                  <option key={ `indicator-${ d.indicator }` } value={ d.indicator }>{ d.display }</option>
                )) }
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Controls;
