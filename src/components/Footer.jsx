import React from 'react';
import { Image, Alert } from 'react-bootstrap';
import Download from './Download';
import Handout from './Handout';
import Sources from './Sources';
import { makeDownloads, makeHandoutUrl, stripZeroes } from './utils.js';

import '../styles/Footer.css';

import src from '../img/logo.png';



const Footer = (props) =>  (
  <div className='Footer'>
    <Alert variant='light'>
      <Alert.Heading as='h2'>Downloads</Alert.Heading>

      <Alert.Heading as='h3'>Download a handout for this district</Alert.Heading>
      <Handout
        district={ stripZeroes(props.district, true) }
        url={ makeHandoutUrl(props.chamber, props.district) }
      />
      <hr />

      <Alert.Heading as='h3'>Download data on all districts</Alert.Heading>
      <Download
        chamber={ props.chamber }
        { ...makeDownloads(props.dwId, props.chamber, 2018) }
      />
      <hr />

      <Sources sources={ props.sources } />

      <hr />

      <p>Legislators' names and websites are current as of February 2020.</p>

      <a href='http://www.ctdatahaven.org'><Image src={ src } id='logo' alt='DataHaven logo' /></a>
    </Alert>
  </div>
);


export default Footer;
