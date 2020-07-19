import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View} from '../basicComponents';

import {flipFlopColors, uiConstants} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: flipFlopColors.white,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM_ONBOARDING,
  },
});

function Wrapper({backgroundColor, style, children, ...restProps}) {
  return (
    <View style={[styles.wrapper, style, {backgroundColor}]} {...restProps}>
      {children}
    </View>
  );
}

Wrapper.defaultProps = {
  backgroundColor: flipFlopColors.white,
};
Wrapper.propTypes = {
  children: PropTypes.node,
  style: stylesScheme,
  backgroundColor: PropTypes.string,
};

export default Wrapper;
