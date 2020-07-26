import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View} from '../basicComponents';
import {stylesScheme} from '/schemas';
import CountryIcon from './CountryIcon';

const styles = StyleSheet.create({
  countryIcons: {
    flexDirection: 'row',
  },
  defaultOriginCountryIconStyle: {
    zIndex: 1,
  },
});

const CountriesIcons = ({
  style,
  originCountry,
  destinationCountry,
  iconStyle,
  size,
  originCountryIconStyle,
  destinationCountryIconStyle,
}) => (
  <View style={[styles.countryIcons, style]}>
    <CountryIcon
      countryCode={originCountry.countryCode}
      size={size}
      style={[
        styles.defaultOriginCountryIconStyle,
        iconStyle,
        originCountryIconStyle,
      ]}
    />
    <CountryIcon
      countryCode={destinationCountry.countryCode}
      size={size}
      style={[
        {marginLeft: -size / 3.25},
        iconStyle,
        destinationCountryIconStyle,
      ]}
    />
  </View>
);

CountriesIcons.propTypes = {
  style: stylesScheme,
  originCountry: PropTypes.object,
  destinationCountry: PropTypes.object,
  iconStyle: stylesScheme,
  size: PropTypes.number.isRequired,
  originCountryIconStyle: stylesScheme,
  destinationCountryIconStyle: stylesScheme,
};

export default CountriesIcons;
