import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {View, Image} from '../../../components/basicComponents';

import images from '../../../assets/images';

const styles = StyleSheet.create({
  // a dummy gradients for the search header sticky mode
  dummyGradientBase: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: 60,
    top: -10,
  },
  dummyGradient: {
    transform: [{rotateZ: '180deg'}],
    top: 40,
  },
});

function Header({children}) {
  return (
    <View>
      <Image
        source={images.common.gradientWhite}
        resizeMode="stretch"
        style={styles.dummyGradientBase}
      />
      <Image
        source={images.common.gradientWhite}
        resizeMode="stretch"
        style={[styles.dummyGradientBase, styles.dummyGradient]}
      />
      {children}
    </View>
  );
}

Header.propTypes = {
  children: PropTypes.element,
};

export default Header;
