import React from 'react';
import { Alert } from 'react-bootstrap';

const text = 'Source: DataHaven analysis (2020) of';

const Sources = (props) => (
  <div className='Sources'>
    <Alert.Heading as='h2'>{ text }</Alert.Heading>
    <ul id='sources-ul'>
      { props.sources.map((d, i) => (
        <li key={ `source-${ i }` }>
          <span className='source'>{ d.source }</span> (<span>{ d.year }</span>). <a href={ d.url }>{ d.project }</a>
        </li>
      )) }
    </ul>
  </div>
);

export default Sources;
