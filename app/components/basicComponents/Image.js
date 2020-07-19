import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Image as RnImage, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
// import { Logger } from '/infra/reporting';

const defaultStyles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
  },
});

const fastImageResizesModes = {
  contain: FastImage.resizeMode.contain,
  cover: FastImage.resizeMode.cover,
  stretch: FastImage.resizeMode.stretch,
  center: FastImage.resizeMode.center,
};

class Image extends Component {
  static getSize(uri, onSuccess, onError) {
    RnImage.getSize(uri, onSuccess, onError);
  }

  static prefetch(uri) {
    RnImage.prefetch(uri);
  }

  static isIOSLocalFile(uri) {
    return uri.startsWith('/private/') || uri.startsWith('/Users/');
  }

  static isAndroidLocalFile(uri) {
    return uri.startsWith('file://');
  }

  render() {
    const {
      style,
      source,
      resizeMode,
      withInitialDimensions,
      ...restProps
    } = this.props;
    if (!source) {
      return null;
    }

    let safeSource = typeof source === 'object' ? {...source} : source;
    if (typeof safeSource.uri === 'string') {
      safeSource.uri = safeSource.uri.trim();
      const {uri} = safeSource;
      if (uri.slice(0, 2) === '//') {
        safeSource = {uri: `http:${uri}`};
      }
      if (
        !uri ||
        (!uri.startsWith('http') &&
          !Image.isIOSLocalFile(uri) &&
          !Image.isAndroidLocalFile(uri))
      ) {
        // Logger.debug({ message: 'Not showing image', uri, source });
        return null;
      }
    }

    return (
      <FastImage
        style={[withInitialDimensions && defaultStyles.wrapper, style]}
        source={safeSource}
        resizeMode={fastImageResizesModes[resizeMode]}
        {...restProps}
      />
    );
  }
}

Image.defaultProps = {
  resizeMode: 'cover',
  withInitialDimensions: true,
};

Image.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  resizeMode: PropTypes.oneOf(['stretch', 'cover', 'contain', 'center']),
  withInitialDimensions: PropTypes.bool,
};

export default Image;
