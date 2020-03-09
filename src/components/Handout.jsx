import React from 'react';

const Handout = (props) => (
  <div className='Handout'>
    <p><a href={ props.url }>Download</a> a printable profile for { props.district } (pdf).</p>
  </div>
);

export default Handout;
