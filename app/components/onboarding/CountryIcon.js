import React from 'react';
import PropTypes from 'prop-types';

import {Image} from '../basicComponents';
import {stylesScheme} from '../../schemas';
import {getCountryImageByCode} from '../../screens/signup/JoinCommunity/countries';

const DEFAULT_ICON_SIZE = 40;

function CountryIcon({countryCode, size, style}) {
  return (
    <Image
      style={[style, {width: size, height: size, borderRadius: size}]}
      source={{uri: getCountryImageByCode(countryCode)}}
    />
  );
}

CountryIcon.defaultProps = {
  size: DEFAULT_ICON_SIZE,
};

CountryIcon.propTypes = {
  size: PropTypes.number,
  countryCode: PropTypes.number,
  style: stylesScheme,
};

export default CountryIcon;
