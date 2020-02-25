import * as _ from 'lodash';
import * as topojson from 'topojson-client';
import { scaleThreshold, scaleOrdinal } from 'd3-scale';
import { format } from 'd3-format';
import { ckmeans } from 'simple-statistics';
import Color from 'color';

///////////// general utilities
const _unbox = (data) => (
  data.length > 1 ? data : data[0]
);

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

const stripZeroes = (location, keepChamber = false) => {
  const numbers = location.match(/\d+/);
  if (_.isNull(numbers)) {
    return location;
  } else {
    if (keepChamber) {
      return `${ location.charAt(0) }${ +numbers }`;
    } else {
      return +numbers;
    }
  }
};

const makeVizHdr = (viz, meta, indicator) => {
  if (viz === 'map') {
    const submeta = _filterByKey(meta.indicators, 'indicator', indicator);
    return _.values(submeta).length ? submeta.display : '';
  } else {
    return `${ meta.display } indicators`;
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
    .sortBy([(d) => d.location === district])
    .groupBy('level')
    .mapValues(_unbox)
    .value();
};

const getProfile = (data, location, meta, compareCt = false) => {
  let profData;
  if (compareCt) {
    profData = _.filter(data, (d) => (d.location === location || d.level === 'state'));
  } else {
    profData = [_filterByKey(data, 'location', location)];
  }
  profData = _.compact(profData);
  if (profData.length === 0) {
    return [];
  } else {
    const locations = _.map(profData, 'location').map((l) => stripZeroes(l, true));
    const wide = _.map(meta, (m) => {
      const vals = _.chain(profData)
        .map((d) => d[m.indicator])
        .map(fmt(m.format))
        .value();
      return {
        indicator: m.display,
        ..._.zipObject(locations, vals)
      };
    });
    return wide;
    // return [];
  }
};

const makeProfColumns = (row) => {
  const cols = _.chain(row)
    .keys()
    .pull('indicator')
    .map((c) => ({
      dataField: c,
      text: _.upperFirst(c),
      align: 'right',
      classes: 'text-right'
    }))
    .value();
  const indicatorCol = {
    dataField: 'indicator',
    text: 'Indicator',
    classes: 'table-header-col'
  };
  return [indicatorCol, ...cols];
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

const makeQualScales = (district, scheme, minStroke = 0, maxStroke = 2) => {
  const color = Color(_.last(scheme));
  const desat = color.desaturate(0.95).lighten(0.3).alpha(0.7).string();
  const hilite = {
    fill: color,
    strokeWidth: maxStroke,
    stroke: color
  };
  const other = {
    fill: desat,
    // strokeWidth: 0.5,
    stroke: '#efefef'
  };
  const both = {
    // stroke: color,
    // r: 5
  };
  return (
    (d, dist) => (d.location === dist ? { ...hilite, ...both } : { ...other, ...both })
  );
};

const makeTooltip = (location, value, format) => (
  `Dist. ${ stripZeroes(location) }: ${ fmt(format)(value) }`
);

const getExtent = (data, indicator, pad = 0.08) => {
  const values = _.map(data, indicator);
  const min = _.min(values);
  const max = _.max(values);
  const range = max - min;
  return [min - (range * pad), max + (range * pad)];
};

const makeAvgAnnotation = (value, format, lbl = 'CT avg', dy = -10) => ({
  type: 'r',
  value: value,
  className: 'chart-annotation',
  color: '#333',
  dy: dy,
  dx: 0,
  // disable: ['connector'],
  connector: { end: 'none' },
  note: {
    label: `${ lbl }: ${ fmt(format)(value) }`,
    align: 'top',
    // padding: -10,
    orientation: 'topBottom',
    lineType: null
  }
});

///////////////// export

export {
  compileHeader,
  firstDistrict,
  fmt,
  getBounds,
  getExtent,
  getLegislator,
  getMappable,
  getProfile,
  getSubMeta,
  makeAvgAnnotation,
  makeChartData,
  makeChoroScale,
  makeGeoJson,
  makeGeoLayers,
  makeMapData,
  makeProfColumns,
  makeQualScales,
  makeTitle,
  makeTooltip,
  makeVizHdr,
  stripZeroes
};
