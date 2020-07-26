import React from 'react';
import PropTypes from 'prop-types';
import {View, Image} from '../../components/basicComponents';
import {stylesScheme} from '../../schemas/common';
import {
  getCountryImageByCode,
  getCountryImageByName,
} from './JoinCommunity/countries';

function CountryIcon({country, style}) {
  const {name, countryCode} = country;
  const iconSource =
    getCountryImageByName(name) || getCountryImageByCode(countryCode);
  return iconSource ? (
    <Image style={style} source={{uri: iconSource}} />
  ) : (
    <View />
  );
}

CountryIcon.propTypes = {
  style: stylesScheme,
  country: PropTypes.object,
};

export default React.memo(CountryIcon);
