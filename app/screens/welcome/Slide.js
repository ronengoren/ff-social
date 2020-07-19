import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Dimensions} from 'react-native';
import {View, Video} from '../../components/basicComponents';
import videos from '../../assets/videos';
import {flipFlopColors, uiConstants} from '../../vars';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.white,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const VIDEO_RATIO = 1.25;
const CONTENT_HEIGHT_WITHOUT_VIDEO = 320;

class Slide extends React.Component {
  state = {
    paused: true,
  };

  render() {
    const {children, width, repeat} = this.props;
    const {paused} = this.state;
    let videoWidth;
    const {height: screenHeight} = Dimensions.get('window');

    if (
      screenHeight <= uiConstants.SMALL_DEVICE_HEIGHT ||
      screenHeight <= (width - 50) / VIDEO_RATIO + CONTENT_HEIGHT_WITHOUT_VIDEO
    ) {
      videoWidth = width - 150;
    } else if (
      screenHeight <= uiConstants.NORMAL_DEVICE_HEIGHT ||
      screenHeight <= width / VIDEO_RATIO + CONTENT_HEIGHT_WITHOUT_VIDEO
    ) {
      videoWidth = width - 50;
    } else {
      videoWidth = width;
    }
    return (
      <View style={[styles.wrapper, {width}]}>
        {children}
        <View style={{width: videoWidth, height: videoWidth / VIDEO_RATIO}}>
          <Video
            style={styles.video}
            source={this.videoSource}
            onRef={(ref) => {
              this.player = ref;
            }}
            rate={1.0}
            volume={0}
            muted
            paused={paused}
            resizeMode="contain"
            repeat={repeat}
            progressUpdateInterval={10000}
            onLoadStart={null}
            onLoad={this.setPaused}
            onProgress={null}
            onEnd={null}
            onError={null}
          />
        </View>
      </View>
    );
  }

  static getDerivedStateFromProps(props) {
    if (props.isScrolling) {
      return {paused: true};
    } else if (props.currentSlide === props.slide) {
      return {paused: false};
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentSlide !== this.props.currentSlide) {
      this.player && this.player.seek(0);
    }
  }

  videoSource = videos.welcome[`video${this.props.slide + 1}`];

  setPaused = () => {
    const {slide} = this.props;
    this.setState({paused: slide !== 0});
  };
}

Slide.propTypes = {
  slide: PropTypes.number,
  currentSlide: PropTypes.number,
  children: PropTypes.node,
  width: PropTypes.number,
  repeat: PropTypes.bool,
};

export default Slide;
