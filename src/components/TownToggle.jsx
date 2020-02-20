import React from 'react';
import { Form } from 'react-bootstrap';

const TownToggle = (props) => (
  <Form>
    <Form.Check
      custom
      type='checkbox'
      id='townCheck'
      label='Show town boundaries'
      onChange={ props.onChange }
    />
  </Form>
);

export default TownToggle;
