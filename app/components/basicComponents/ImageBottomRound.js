import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {Image} from '../basicComponents';
import images from '../../assets/images';

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
  imageBorder: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  imageMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
});

class ImageBottomRound extends Component {
  render() {
    const {source, mediaUrl, height, withBorderRadius} = this.props;
    return [
      <Image
        source={source || {uri: mediaUrl}}
        style={[styles.image, withBorderRadius && styles.imageBorder, {height}]}
        resizeMode="cover"
        key="image"
      />,
      <Image
        source={images.common.bottomRoundedBorder}
        style={[styles.imageMask, {height}]}
        resizeMode="stretch"
        key="mask"
      />,
    ];
  }
}

ImageBottomRound.defaultProps = {
  height: 210,
  withBorderRadius: true,
};

ImageBottomRound.propTypes = {
  withBorderRadius: PropTypes.bool,
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  mediaUrl: PropTypes.string,
  height: PropTypes.number,
};

export default ImageBottomRound;
