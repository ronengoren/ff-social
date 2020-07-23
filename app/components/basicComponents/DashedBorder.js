import React from 'react';
import {StyleSheet} from 'react-native';
import {Image} from '../basicComponents';
import images from '../../assets/images';
import {stylesScheme} from '../../schemas/common';

const styles = StyleSheet.create({
  dottedBorder: {
    width: '100%',
    height: 1,
  },
});

class DashedBorder extends React.Component {
  render() {
    const {style} = this.props;
    return (
      <Image
        source={images.common.dotted_border}
        style={[styles.dottedBorder, style]}
        resizeMode="cover"
      />
    );
  }
}

DashedBorder.propTypes = {
  style: stylesScheme,
};

export default DashedBorder;
