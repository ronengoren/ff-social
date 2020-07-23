import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {View, Image, DashedBorder} from '../basicComponents';

import images from '../../assets/images';
import {navigationService} from '../../infra/navigation';
import PostContentLocation from './PostContentLocation';
import PostContentLinkRow from './PostContentLinkRow';

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
    overflow: 'hidden',
    height: 101,
  },
  contentWrapper: {
    paddingHorizontal: 15,
  },
  mapImageBg: {
    position: 'absolute',
    right: 40,
    top: -15,
    height: 101,
  },
  mapImage: {
    height: 135,
    width: 292,
  },
  mapGradientBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 101,
  },
  mapGradientImage: {
    height: 101,
  },
  mapTextMeta: {
    flex: 1,
    paddingTop: 11,
  },
  mapTextMetaWithMap: {
    width: '70%',
  },
  additionalMetaMarginTop: {
    marginTop: 3,
  },
});

class PostContentMapMeta extends React.Component {
  render() {
    const {mapUrl} = this.props;

    return mapUrl ? (
      <View style={[styles.mapWrapper, styles.contentWrapper]}>
        {this.renderMap()}
        <DashedBorder />
        {this.renderMeta()}
        <DashedBorder />
      </View>
    ) : (
      <View style={styles.contentWrapper}>{this.renderMeta()}</View>
    );
  }

  renderMap() {
    const {mapUrl} = this.props;
    const {width} = Dimensions.get('window');
    const mapWidth = Math.floor(width * 0.45);
    const gradientWidth = Math.floor(width * 0.8);
    return [
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.mapImageBg, {width: mapWidth}]}
        onPress={this.navigateToMap}
        key="mapImage">
        <Image
          source={{uri: mapUrl}}
          style={styles.mapImage}
          resizeMode={'contain'}
        />
      </TouchableOpacity>,
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.mapGradientBg, {width: gradientWidth}]}
        onPress={this.navigateToMap}
        key="overlayGradient">
        <Image
          source={images.common.gradientLeftRight}
          style={[styles.mapGradientImage, {width: gradientWidth}]}
        />
      </TouchableOpacity>,
    ];
  }

  renderMeta() {
    const {title, location, mapUrl, url, TitleComponent} = this.props;
    const hasLocationDetails =
      !!location && (location.placeName || location.fullAddress);
    const hasUrlWithoutMap = !mapUrl && !!url;
    return (
      <View style={[styles.mapTextMeta, mapUrl && styles.mapTextMetaWithMap]}>
        {!!title && TitleComponent}
        {!!title && (hasLocationDetails || hasUrlWithoutMap) && (
          <View style={styles.additionalMetaMarginTop} />
        )}
        {!!location && this.renderLocation({location, title})}
        {!mapUrl && !!url && this.renderUrl({url})}
      </View>
    );
  }

  renderLocation = ({location, title}) => (
    <PostContentLocation location={location} title={title} />
  );

  renderUrl = ({url}) => <PostContentLinkRow url={url} />;

  navigateToMap = () => {
    const {location, title} = this.props;
    navigationService.navigateToMap({title, location});
  };
}

PostContentMapMeta.propTypes = {
  TitleComponent: PropTypes.node,
  mapUrl: PropTypes.string,
  title: PropTypes.string,
  location: PropTypes.object,
  url: PropTypes.string,
};

export default PostContentMapMeta;
