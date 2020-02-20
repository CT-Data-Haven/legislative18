import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useForm, FormContext } from 'react-hook-form';
import { schemeBuPu as palette } from 'd3-scale-chromatic';
import { getMappable, firstDistrict, makeMapData, makeChartData, displayIndicator, makeChoroScale, makeQualScales, getProfile, getLegislator, getSubMeta } from './components/utils.js';

import Intro from './components/Intro';
import Stage from './components/Stage';
import Controls from './components/Controls';
import Choropleth from './components/Choropleth';
import Profile from './components/Profile';
import TownToggle from './components/TownToggle';
import Footer from './components/Footer';
import Chart from './components/Chart';
import VizContainer from './components/VizContainer';

import './App.css';

import meta from './data/legislative_meta_2018.json';
import data from './data/legislative_wide_2018.json';
import legislators from './data/legislators.json';
import xwalk from './data/town_lookup.json';
const shapes = {
  house: require('./shapes/house_topo.json'),
  senate: require('./shapes/senate_topo.json'),
  towns: require('./shapes/towns_topo.json')
};
const titles = {
  house: 'Rep.',
  senate: 'Sen.'
};

const App = () => {
  const formMethods = useForm({
    mode: 'onChange'
  });
  const chambers = Object.keys(data);
  const topics = Object.keys(meta[chambers[0]]);
  const initValues = {
    topic: topics[0],
    chamber: chambers[0],
    indicator: getMappable(meta[chambers[0]][topics[0]])[0].indicator,
    district: firstDistrict(chambers[0]),
    showTowns: false
  };

  const [topic, setTopic] = useState(initValues.topic);
  const [chamber, setChamber] = useState(initValues.chamber);
  const [indicator, setIndicator] = useState(initValues.indicator);
  const [district, setDistrict] = useState(initValues.district);
  const [showTowns, setShowTowns] = useState(initValues.showTowns);

  const onFormChange = (formData, e) => {
    const { _chamber, _topic, _indicator } = formMethods.getValues();

    if (e.target.name === '_topic') {
      // need to change to watch for chamber change?
      setIndicator(getMappable(meta[_chamber][_topic])[0].indicator);
    } else {
      setIndicator(_indicator);
    }

    setTopic(_topic);
    setChamber((prevChamber) => _chamber);

    if (e.target.name === '_chamber') {
      setDistrict(firstDistrict(_chamber));
    }
  };

  const onFeatureClick = ({ layer }) => {
    setDistrict(layer.feature.properties.id);
  };

  const onTownToggle = (e) => {
    setShowTowns(e.target.checked);
  };

  const topicMeta = meta[chamber][topic];
  const mapData = makeMapData(data[chamber][topic], indicator);
  const chartData = makeChartData(data[chamber][topic], topicMeta, district);
  const mappable = getMappable(topicMeta);

  return (
    <div className='App'>

      <Container>
        <header className='app-header'>
          <h1>Connecticut Legislative Profiles</h1>
        </header>

        { /* INTRO ROW */ }
        <Row>
          <Col>
            <Intro />
          </Col>
        </Row>

        { /* CONTROLS */ }
        <Row>
          <Col>
            <FormContext { ...formMethods }>
              <Controls
                // topics={ topics }
                indicators={ mappable }
                chambers={ chambers }
                meta={ meta[chamber] }
                onChange={ formMethods.handleSubmit(onFormChange) }
              />
            </FormContext>
          </Col>
        </Row>

        <hr />

        <Row>
          { /* VIZ  */ }
          <Col md={ 7 }>
            <Stage
              location={ district }
              chamber={ chamber }
              lbl={ displayIndicator(topicMeta['indicators'], indicator) }
              type='chart'
            >
              <VizContainer>

                <Choropleth
                  chamber={ chamber }
                  shape={ shapes[chamber] }
                  data={ mapData }
                  colorscale={ makeChoroScale(mapData, palette, 5) }
                  onClick={ onFeatureClick }
                  toggle={ <TownToggle onChange={ onTownToggle } /> }
                  townShp={ shapes['towns'] }
                  showTowns={ showTowns }
                  meta={ getSubMeta(topicMeta.indicators, indicator) }
                />

                <Chart
                  data={ chartData }
                  meta={ mappable }
                  scales={ makeQualScales(district, palette[4]) }
                />

              </VizContainer>

            </Stage>
          </Col>

          { /* PROFILE */ }
          <Col md={ 5 }>
            <Stage
              location={ district }
              chamber={ chamber }
              lbl={ topicMeta.display }
              type='profile'
            >
              <Profile
                data={ getProfile(data[chamber][topic], district, topicMeta.indicators) }
                legislator={ getLegislator(legislators[chamber], district) }
                title={ titles[chamber] }
                towns={ xwalk[chamber][district] }
              />

            </Stage>
          </Col>
        </Row>

        { /* DISTRICT INFO */ }
        <Row>
          <Col>

          </Col>
        </Row>

        <Row>
          <Col>
            <Footer />
          </Col>
        </Row>
      </Container>

    </div>
  )
};

export default App;
