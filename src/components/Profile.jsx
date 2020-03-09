import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { ListGroup } from 'react-bootstrap';
import { makeProfColumns } from './utils.js';

import '../styles/Profile.css';

const Profile = (props) => (
  <div className='Profile' id='profile'>
    <ListGroup variant='flush'>
      { props.legislator &&
        <ListGroup.Item key='prof-district-info'>
          <DistrictInfo { ...props }>
            { props.children }
          </DistrictInfo>
        </ListGroup.Item>
      }
      <ListGroup.Item key='prof-table'>
        <ProfileTable { ...props } />
      </ListGroup.Item>
      { props.towns &&
        <ListGroup.Item key='prof-geography'>
          <TownInfo { ...props } />
        </ListGroup.Item>
      }
    </ListGroup>
  </div>
);

const DistrictInfo = (props) => (
  <div className='infobox'>
    <div className='title'>{ `${ props.title } ${ props.legislator.name } (${ props.legislator.party })` }</div>
    <ul className='list-unstyled'>
      <li className=''><a href={ props.legislator.bill_url }>Sponsored bills, current session</a></li>
      <li className=''><a href={ props.legislator.website }>Website</a></li>
    </ul>
    <div>{ props.children }</div>
  </div>
);

const ProfileTable = (props) => (
  <React.Fragment>
    <BootstrapTable
      bootstrap4
      classes='table'
      headerClasses='thead-light'
      rowClasses={ (row, i) => row.type === 'm' ? 'prof-row-nudge' : 'prof-row'}
      bordered={ false }
      keyField={ 'indicator' }
      data={ props.data }
      columns={ makeProfColumns(props.data[0]) }
      wrapperClasses='table-responsive'
    />
  </React.Fragment>
);

const TownInfo = (props) => (
  <div className='infobox'>
    <p className='small'>Includes all or parts of { props.towns.join(', ') }</p>
  </div>
);

export default Profile;
