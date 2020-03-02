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

export default Toggle;
