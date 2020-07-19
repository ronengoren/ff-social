import React from 'react';
import PropTypes from 'prop-types';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const PlaceholderRectangle = ({
  width,
  height = 10,
  borderRadius = 2,
  marginBottom = 10,
  marginRight = 10,
  backgroundColor = flipFlopColors.fillGrey,
  opacity,
  style,
}) => (
  <View
    style={[
      {
        backgroundColor,
        width,
        height,
        borderRadius,
        marginBottom,
        marginRight,
        opacity,
      },
      style,
    ]}
  />
);

PlaceholderRectangle.propTypes = {
  backgroundColor: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  borderRadius: PropTypes.number,
  marginBottom: PropTypes.number,
  marginRight: PropTypes.number,
  opacity: PropTypes.number,
  style: stylesScheme,
};

export default PlaceholderRectangle;
