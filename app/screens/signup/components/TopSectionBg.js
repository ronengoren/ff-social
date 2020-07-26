import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import images from '/assets/images';
import {View, Image} from '../../../components/basicComponents';

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 260,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
});

function TopSectionBg({children, marginBottom = 0}) {
  return (
    <View style={[styles.wrapper, {marginBottom}]}>
      <Image
        source={images.onboarding.steps_header_bg}
        style={styles.background}
        resizeMode="stretch"
        withInitialDimensions={false}
      />
      {children}
    </View>
  );
}

TopSectionBg.propTypes = {
  children: PropTypes.node,
  marginBottom: PropTypes.number,
};

export default TopSectionBg;
