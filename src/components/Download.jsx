import React from 'react';
import { makeTitle } from './utils';

const Download = (props) => (
  <div className='Download'>
    <p><a href={ props.dl }>Download </a> data for all { makeTitle(props.chamber) } districts (.csv file), filter and analyze data online on <a href={ props.dw }>data.world</a> (requires free sign-up), or download/clone from <a href={ props.gh }>GitHub</a> (advanced users).</p>
  </div>
);

export default Download;
