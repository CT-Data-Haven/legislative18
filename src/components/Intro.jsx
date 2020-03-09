import React from 'react';
import { Alert } from 'react-bootstrap';

import '../styles/Intro.css';

const text = 'Select a legislative chamber, topic, and indicator to view on the map. Clicking a district on the map or a dot on the charts will bring up detailed information on that district and its representative or senator. More detailed printable overviews are available for each district at the bottom of the page. Note that Community Wellbeing Survey indicators are only available for Senate districts.';

const Intro = () => (
	<div className='Intro'>
		<Alert variant='light' className='border border-color-info'>
			<p>{ text } For more information, visit DataHaven's <a href="http://www.ctdatahaven.org/communities">Communities</a> page or <a href="http://www.ctdatahaven.org">main website</a>.</p>
		</Alert>
	</div>
);

export default Intro;
