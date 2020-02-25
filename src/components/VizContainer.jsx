import React from 'react';
import Tabs from 'react-responsive-tabs';

import 'react-responsive-tabs/styles.css';
import '../styles/VizContainer.css';

const makeTitle = (d, t) => (
  <div><span className='nav-icon'>{ t[d.key].icon }</span>{ t[d.key].title }</div>
);

const VizContainer = (props) => {
  const tabs = props.children.map((d, i) => ({
    title: makeTitle(d, props.tabs),
    key: d.key,
    getContent: () => d
  }));
  return (
    <div className='VizContainer'>
      <Tabs
        onChange={ props.onChange }
        items={ tabs }
        transform={ false }
        showMore={ false }
        tabClassName='viz-tab-nav'
        panelClassName='viz-tab-panel'
      />
    </div>
  );
};

export default VizContainer;
