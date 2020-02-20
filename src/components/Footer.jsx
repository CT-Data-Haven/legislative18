import React from 'react';
import { Image, Alert } from 'react-bootstrap';
// import Download from './Download';
// import Sources from './Sources';
// import { makeDownloads } from './utils.js';

import '../styles/Footer.css';

import src from '../img/logo.png';



const Footer = (props) =>  (
  <div className='Footer'>
    <Alert variant='light'>
      <Alert.Heading as='h2'>Downloads</Alert.Heading>

      <Alert.Heading as='h3'>Download district handouts</Alert.Heading>

      <hr />

      <Alert.Heading as='h3'>Download data on all districts</Alert.Heading>

      <hr />

      <p>Legislators' names and websites are current as of February 2020.</p>

      <a href='http://www.ctdatahaven.org'><Image src={ src } id='logo' alt='DataHaven logo' /></a>
    </Alert>
  </div>
);


export default Footer;
