import React from 'react';
import { Map, TileLayer, GeoJSON, LayerGroup, LayersControl } from 'react-leaflet';
import { getBounds, makeGeoLayers, makeGeoJson, makeTooltip } from './utils.js';

import '../styles/Chart.css';

const { Overlay } = LayersControl;

const townStyle = {
  fillColor: 'transparent',
  color: '#555',
  weight: 1,
  pointerEvents: 'none'
};

export default class Choropleth extends React.Component {

  getStyle = (feature) => {
    const id = feature.properties.id;
    const fillColor = this.props.data[id] ? this.props.colorscale(this.props.data[id].value) : '#ccc';
    return {
      fillColor,
      color: '#333',
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.75
    };
  };

  handleFeature = (feature, layer) => {
    let id = feature.properties.id;
    layer
      .on('mouseover', this.featureHilite)
      .on('mouseout', this.featureUnhilite);
    layer.bindTooltip(() => (
      makeTooltip(this.props.data, id, this.props.meta)),
      { direction: 'top', offset: [0, -20], className: 'custom-tip' }
    );
  };

  featureHilite = ({ target }) => {
    target.setStyle({
      fillOpacity: 0.95,
      weight: 1
    });

  };
  featureUnhilite = ({ target }) => {
    target.setStyle({
      fillOpacity: 0.75,
      weight: 0.5
    });
  };

  render() {
    const bbox = getBounds(this.props.shape);
    const layers = makeGeoLayers(this.props.shape);
    const townGeo = makeGeoJson(this.props.townShp);

    return (
      <div className='Chart Choropleth'>
        { this.props.toggle }
        <Map
          key={ this.props.chamber }
          bounds={ bbox }
          zoomSnap={ 0.5 }
          zoomDelta={ 0.5 }
          scrollWheelZoom={ false }
        >
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ ext }"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            subdomains="abcd"
            minZoom={ 8 }
            maxZoom={ 16 }
            ext="png"
            opacity={ 0.4 }
          />
          <LayersControl>
            <Overlay checked name='districts'>
              <LayerGroup key={ this.props.chamber }>
                <GeoJSON
                  data={ layers.districts }
                  key={ (feature) => feature.properties.id }
                  style={ this.getStyle }
                  onClick={ this.props.onClick }
                  onEachFeature={ this.handleFeature }
                />
              </LayerGroup>
            </Overlay>
            <Overlay checked={ this.props.showTowns } name='towns'>
              <LayerGroup key='towns'>
                <GeoJSON
                  data={ townGeo }
                  style={ townStyle }
                  interactive={ false }
                />
              </LayerGroup>
            </Overlay>
          </LayersControl>
        </Map>
      </div>
    )
  }
}
