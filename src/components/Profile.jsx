import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { ListGroup } from 'react-bootstrap';

import '../styles/Profile.css';

const Profile = (props) => {
  return (
    <div className='Profile' id='profile'>
      <ListGroup variant='flush'>
        { props.legislator &&
          <ListGroup.Item>
            <DistrictInfo { ...props } />
          </ListGroup.Item>
        }
        <ListGroup.Item>
          <ProfileTable { ...props } />
        </ListGroup.Item>
        { props.towns &&
          <ListGroup.Item>
            <TownInfo { ...props } />
          </ListGroup.Item>
        }
      </ListGroup>
    </div>
  )
};

const DistrictInfo = (props) => (
  <div className='infobox'>
    <div className='title'>{ `${ props.title } ${ props.legislator.name } (${ props.legislator.party })` }</div>
    <ul className='list-unstyled'>
      <li className=''><a href={ props.legislator.bill_url }>Sponsored bills, current session</a></li>
      <li className=''><a href={ props.legislator.website }>Website</a></li>
    </ul>
  </div>
);

const ProfileTable = (props) => (
  <>
    <BootstrapTable
      bootstrap4
      classes='table'
      headerClasses='thead-light'
      bordered={ false }
      keyField={ 'indicator' }
      data={ props.data }
      columns={ [{
        dataField: 'indicator',
        text: 'Indicator',
        classes: 'table-header-col'
      }, {
        dataField: 'value',
        text: 'Value',
        align: 'right',
        classes: 'text-right'
      }] }
      wrapperClasses='table-responsive'
    />
  </>
);

const TownInfo = (props) => (
  <div className='infobox'>
    <p className='small'>Includes all or parts of { props.towns.join(', ') }</p>
  </div>
);

export default Profile;
