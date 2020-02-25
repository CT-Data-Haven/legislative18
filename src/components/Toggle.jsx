import React from 'react';
import { Form } from 'react-bootstrap';

const Toggle = (props) => (
  <Form>
    <Form.Check
      custom
      type='checkbox'
      { ...props }
    />
  </Form>
);

const TownToggle = (props) => (
  <Form>
    <Form.Check
      custom
      type='checkbox'
      id='townCheck'
      label='Show town boundaries'
      onChange={ props.onChange }
      checked={ props.checked }
    />
  </Form>
);

export default Toggle;
