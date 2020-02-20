import * as _ from 'lodash';
import * as topojson from 'topojson-client';
import { scaleThreshold, scaleOrdinal } from 'd3-scale';
import { format } from 'd3-format';
import { ckmeans } from 'simple-statistics';
import Color from 'color';

///////////// filtering
const _filterByKey = (data, key, value, first = true) => (
  first ? _.find(data, { [key]: value }) : _.filter(data, { [key]: value })
);

const getMappable = (meta) => (
  _filterByKey(meta.indicators, 'type', 'm', false)
);

const getLegislator = (legs, district) => (
  _filterByKey(legs, 'id', district)
);

const getSubMeta = (meta, indicator) => (
  _filterByKey(meta, 'indicator', indicator)
);

///////////// strings + display
const fmt = (fmtStr) => (
  (d) => (d === null || d === undefined ? 'N/A' : format(fmtStr)(d))
);

const firstDistrict = (chamber) => (
  chamber.charAt(0).toUpperCase() + '001'
);

const makeTitle = (lbl, capAll = false) => {
  const wrds = _.replace(lbl, /_/g, ' ');
  return capAll ? _.startCase(wrds) : _.upperFirst(wrds);
};

const displayIndicator = (indicators, indicator) => {
  const meta = getSubMeta(indicators, indicator);
  return _.values(meta).length ? meta.display : '';
};

const stripZeroes = (location) => {
  const numbers = location.match(/\d+/);
  if (numbers.length) {
    // return `${ location.charAt(0) }${ +numbers }`;
    return +numbers;
  } else {
    return location;
  }
};

const compileHeader = (type) => {
  const headers = {
    chart: '<%= lbl %> by <%= chamber %> district',
    profile: '<%= lbl %> at a glance, <%= chamber %> District <%= location %>'
  };
  return _.template(headers[type]);
};

////////////// data prep + shaping
const makeMapData = (topicData, indicator) => (
  _.chain(topicData)
    .filter((d) => _.endsWith(d.level, 'district'))
    .map((d) => ({
      name: d.location,
      value: d[indicator]
    }))
    .keyBy('name')
    .value()
);

const makeChartData = (topicData, topicMeta, district) => {
  const indicators = _.map(getMappable(topicMeta), 'indicator');
  return _.chain(topicData)
    .map((d) => _.pick(d, ['level', 'location', ...indicators]))
    .filter({ level: 'district' })
    .sortBy([(d) => d.location === district])
    .value();
};

const getProfile = (data, name, meta) => {
  const locData = _filterByKey(data, 'location', name);
  return locData ? meta.map((d) => ({
    indicator: d.display,
    value: fmt(d.format)(locData[d.indicator])
  })) : [];
};

//////////////// geography
const getBounds = (geo) => {
  const b = topojson.bbox(geo);
  return [[ b[1], b[0] ], [ b[3], b[2] ]];
}

const makeGeoJson = (shp) => (
  topojson.feature(shp, shp.objects.shape)
);

const makeGeoLayers = (shp) => {
  const districts = makeGeoJson(shp);
  // add town boundaries?
  return { districts };
};

////////////// viz
const makeChoroScale = (data, scheme, nBrks) => {
  const vals = _.chain(data)
    .mapValues('value')
    .values()
    .sort()
    .value();
  if (!vals.length) {
    return scaleThreshold().domain([0, 1]).range(['#ccc']);
  } else {
    const brks = ckmeans(vals, nBrks).map((d) => d[0]).slice(1);
    return scaleThreshold()
      .domain(brks)
      .range(scheme[nBrks]);
  }
};

const makeQualScales = (district, scheme, minStroke = 0, maxStroke = 4) => {
  const color = Color(_.last(scheme));
  const desat = color.desaturate(0.95).lighten(0.4).alpha(0.8).string();
  const hilite = {
    fill: color,
    strokeWidth: maxStroke,
    stroke: color
  };
  const other = {
    fill: desat,
    strokeWidth: 0.5,
    stroke: '#efefef'
  };
  const both = {
    // stroke: color,
    // r: 5
  };
  return (
    (d) => (d.location === district ? { ...hilite, ...both } : { ...other, ...both })
  );
};

const makeTooltip = (data, name, meta) => {
  const val = data[name] ? data[name].value : null;
  const format = meta.format;
  return `Dist. ${ stripZeroes(name) }: ${ fmt(format)(val) }`;
};

const getExtent = (data, indicator, pad = 0.08) => {
  const values = _.map(data, indicator);
  const min = _.min(values);
  const max = _.max(values);
  const range = max - min;
  return [min - (range * pad), max + (range * pad)];
};

///////////////// export

export {
  compileHeader,
  displayIndicator,
  firstDistrict,
  fmt,
  getBounds,
  getExtent,
  getLegislator,
  getMappable,
  getProfile,
  getSubMeta,
  makeChartData,
  makeChoroScale,
  makeGeoJson,
  makeGeoLayers,
  makeMapData,
  makeQualScales,
  makeTitle,
  makeTooltip,
  stripZeroes
};
