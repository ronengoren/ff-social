import React from 'react';
import {StyleSheet, StatusBar, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {View, Image, Video} from '../basicComponents';
import {stylesScheme} from '../../schemas';

const {width} = Dimensions.get('window');
const VIDEO_RATIO = 1.3186813186813187;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  imageBG: {
    alignSelf: 'flex-end',
    width,
    height: width / VIDEO_RATIO,
  },
  video: {
    width,
    height: width / VIDEO_RATIO,
  },
});

function HeaderMedia(props) {
  const {
    videoSource,
    imageSource,
    imageStyle,
    videoStyle,
    wrapperStyle,
  } = props;
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      {imageSource && (
        <Image source={imageSource} style={[styles.imageBG, imageStyle]} />
      )}
      {videoSource && (
        <Video
          style={[styles.video, videoStyle]}
          source={videoSource}
          rate={1.0}
          volume={0}
          muted
          paused={false}
          resizeMode="contain"
          repeat
          progressUpdateInterval={10000}
          onLoadStart={null}
          onLoad={null}
          onProgress={null}
          onEnd={null}
          onError={null}
        />
      )}
    </View>
  );
}

HeaderMedia.propTypes = {
  wrapperStyle: stylesScheme,
  imageStyle: stylesScheme,
  videoStyle: stylesScheme,
  imageSource: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  videoSource: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
};

export default HeaderMedia;
