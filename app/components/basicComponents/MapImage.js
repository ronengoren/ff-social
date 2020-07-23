import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image, View} from '../basicComponents';
import {navigationService} from '../../infra/navigation';
import {stylesScheme} from '../../schemas/common';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 95,
  },
});

class MapImage extends Component {
  render() {
    const {location, title, linkable} = this.props;

    if (linkable) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={
            linkable
              ? () => navigationService.navigateToMap({location, title})
              : null
          }>
          {this.renderImage()}
        </TouchableOpacity>
      );
    }
    return <View>{this.renderImage()}</View>;
  }

  renderImage() {
    const {mapUrl, imageStyle} = this.props;

    return (
      <Image
        source={{uri: mapUrl}}
        style={[styles.image, imageStyle]}
        resizeMode="cover"
      />
    );
  }
}

MapImage.defaultProps = {
  linkable: true,
};

MapImage.propTypes = {
  mapUrl: PropTypes.string.isRequired,
  location: PropTypes.shape({coordinates: PropTypes.arrayOf(PropTypes.number)}),
  title: PropTypes.string,
  linkable: PropTypes.bool,
  imageStyle: stylesScheme,
};

export default MapImage;
