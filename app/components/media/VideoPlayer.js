import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import {View, Text, Spinner, Image, Video} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import images from '../../assets/images';
import {formatVideoTime} from '../../infra/utils/dateTimeUtils';
import {isNil} from '../../infra/utils';

const ANIMATION_DURATION = 350;

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.realBlack,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controlsWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.transparent,
  },
  spinner: {
    position: 'absolute',
    bottom: 60,
    right: 15,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 50,
    width: '100%',
  },
  playBtnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: flipFlopColors.halfRealBlack,
    borderWidth: 1,
    borderColor: flipFlopColors.white80,
  },
  playBtn: {
    marginLeft: 4,
  },
  countersWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countersWrapperLandscape: {
    bottom: 30,
  },
  counter: {
    backgroundColor: flipFlopColors.transparent,
  },
  seekPanelWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 15,
    left: 15,
    height: 5,
    backgroundColor: flipFlopColors.b60,
  },
  seekPanelWrapperLandscape: {
    bottom: 10,
  },
  seekPanel: {
    height: 5,
    backgroundColor: flipFlopColors.green,
  },
  seekPointer: {
    position: 'absolute',
    right: 0,
    height: 14,
    width: 14,
    marginTop: -5,
    borderRadius: 50,
    backgroundColor: flipFlopColors.green,
  },
  seekHandle: {
    position: 'absolute',
    bottom: -15,
    right: 15,
    left: 15,
    paddingVertical: 15,
    backgroundColor: flipFlopColors.transparent,
  },
});

const videoPlayerButtons = {
  play: {
    size: 20,
    name: 'play',
  },
  pause: {
    size: 21,
    name: 'pause',
  },
  replay: {
    size: 26,
    name: 'sync-alt',
  },
};

class VideoPlayer extends Component {
  constructor(props) {
    super();
    const {autoPlay, paused} = props;
    const isPaused = isNil(paused) ? !autoPlay : paused;
    this.state = {
      showLoader: true,
      controlBtn: isPaused ? 'play' : 'pause',
      paused: isPaused,
      muted: false,
      elapsedTime: -1,
      calculatedRatio: 1,
      videoLoaded: false,
    };
    this.controlsOpacity = new Animated.Value(1);
    this.duration = 0;
    this.seekPanResponder = PanResponder;
    this.seekerWidth = 0;
  }

  render() {
    const {
      showLoader,
      controlBtn,
      muted,
      elapsedTime,
      calculatedRatio,
      videoLoaded,
      paused,
    } = this.state;
    const {
      resizeMode,
      repeat,
      hideDuration,
      url,
      style,
      maxHeight,
      width,
      ratio,
      poster,
      landscapeMode,
    } = this.props;
    let height = width / (ratio || calculatedRatio);
    height = height > maxHeight ? maxHeight : height;
    const showPoster = poster && !videoLoaded;
    const extraVideoParams = repeat
      ? {}
      : {
          onProgress: this.onVideoProgress,
          onBuffer: this.onVideoBuffer,
          onEnd: this.onVideoEnd,
        };
    return (
      <TouchableOpacity
        style={[styles.container, style, {height, width}]}
        accessibilityTraits="button"
        accessibilityComponentType="button"
        activeOpacity={1}
        onPress={this.toggleControlsVisibility}>
        <Video
          style={styles.backgroundVideo}
          source={{
            uri: url,
            mainVer: 1,
            patchVer: 0,
          }}
          onRef={this.onRef}
          rate={1.0}
          volume={1.0}
          muted={muted}
          paused={paused}
          resizeMode={resizeMode}
          repeat={repeat}
          progressUpdateInterval={500}
          onLoadStart={null}
          poster={showPoster ? poster : null}
          posterResizeMode="cover"
          onLoad={this.onVideoLoad}
          {...extraVideoParams}
          onError={null}
          ignoreSilentSwitch="ignore"
        />
        {(this.controlsOpacity._value > 0 || showPoster) && (
          <Animated.View
            style={[styles.controlsWrapper, {opacity: this.controlsOpacity}]}>
            {!repeat && (
              <TouchableOpacity
                style={styles.playBtnWrapper}
                onPress={this.togglePauseState}
                activeOpacity={1}>
                <AwesomeIcon
                  name={videoPlayerButtons[controlBtn].name}
                  color={flipFlopColors.white}
                  size={videoPlayerButtons[controlBtn].size}
                  weight="solid"
                  style={controlBtn === 'play' && styles.playBtn}
                />
              </TouchableOpacity>
            )}

            <Image
              style={styles.gradient}
              source={images.common.gradientDownTop}
              resizeMode="stretch"
            />

            {!hideDuration && elapsedTime >= 0 && (
              <View
                style={[
                  styles.countersWrapper,
                  landscapeMode && styles.countersWrapperLandscape,
                ]}>
                <Text style={styles.counter} color={flipFlopColors.white}>
                  {formatVideoTime(elapsedTime)}
                </Text>
                <Text style={styles.counter} color={flipFlopColors.white}>
                  {this.durationString}
                </Text>
              </View>
            )}

            {!repeat && (
              <View
                style={[
                  styles.seekPanelWrapper,
                  landscapeMode && styles.seekPanelWrapperLandscape,
                ]}
                onLayout={this.setSeekerWidth}>
                <View
                  style={[
                    styles.seekPanel,
                    {width: this.calculateSeekerPosition()},
                  ]}>
                  <View style={styles.seekPointer} />
                </View>
                <View
                  style={styles.seekHandle}
                  {...this.seekPanResponder.panHandlers}
                />
              </View>
            )}
          </Animated.View>
        )}
        {showLoader && !repeat && (
          <Spinner
            center
            color={flipFlopColors.white}
            size="large"
            style={styles.spinner}
          />
        )}
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    this.seekPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.setState({seeking: true});
        this.immediateShowControls();
        this.setSeekerPosition(gestureState.x0);
      },

      onPanResponderMove: (evt) => {
        this.setSeekerPosition(evt.nativeEvent.locationX);
      },

      onPanResponderRelease: () => {
        this.startHideControlsTimer();
        this.setState({seeking: false});
      },
    });
  }

  componentDidUpdate(prevProps) {
    const {paused} = this.props;
    if (paused !== prevProps.paused) {
      if (paused) {
        this.pauseVideo();
      } else {
        this.playVideo();
      }
    }
  }

  onRef = (node) => {
    if (!this.player) {
      this.player = node;
    }
  };

  onVideoLoad = (data) => {
    const ratio =
      data.naturalSize.orientation === 'portrait'
        ? data.naturalSize.height / data.naturalSize.width
        : data.naturalSize.width / data.naturalSize.height;
    this.duration = data.duration;
    this.durationString = formatVideoTime(this.duration);
    this.setState({
      showLoader: false,
      elapsedTime: 0,
      calculatedRatio: ratio,
      videoLoaded: true,
    });
  };

  onVideoProgress = (data) => {
    const {seeking} = this.state;
    if (seeking) {
      return;
    }
    this.setState({
      elapsedTime: data.currentTime,
      showLoader: false,
    });
  };

  onVideoBuffer = () => {
    this.immediateShowControls();
    this.setState({showLoader: true});
    this.startHideControlsTimer();
  };

  onVideoEnd = () => {
    this.immediateShowControls();
    this.setState({
      controlBtn: 'replay',
      paused: true,
      elapsedTime: this.duration,
      showLoader: false,
    });
  };

  setSeekerWidth = (event) => {
    this.seekerWidth = event.nativeEvent.layout.width;
  };

  calculateSeekerPosition = () =>
    this.duration
      ? this.seekerWidth * (this.state.elapsedTime / this.duration) + 8
      : 8;

  setSeekerPosition = (position = 0) => {
    let newPosition = position;
    if (newPosition <= 0) {
      newPosition = 0;
    } else if (newPosition >= this.seekerWidth - 2) {
      newPosition = this.seekerWidth;
    }

    const elapsedTime =
      newPosition < this.seekerWidth
        ? this.duration * (position / this.seekerWidth)
        : this.duration;
    this.player.seek(elapsedTime);
    const newState = {elapsedTime};
    if (this.state.paused && newPosition < this.seekerWidth) {
      newState.controlBtn = 'play';
    }
    this.setState(newState);
  };

  toggleControlsVisibility = () => {
    this.clearHideControlsTimer();
    const {paused} = this.state;
    if (paused && this.controlsOpacity._value > 0) {
      this.controlsOpacity.setValue(0);
      this.playVideo();
    } else if (this.controlsOpacity._value > 0) {
      this.animateControls(ANIMATION_DURATION, 0);
    } else {
      this.animateControls(ANIMATION_DURATION, 1);
    }
  };

  pauseVideo = () => {
    this.clearHideControlsTimer();
    this.setState({
      controlBtn: 'play',
      paused: true,
      showLoader: false,
    });
    this.startHideControlsTimer();
  };

  playVideo = () => {
    this.clearHideControlsTimer();
    const {elapsedTime} = this.state;
    const newState = {
      controlBtn: 'pause',
      paused: false,
    };
    if (elapsedTime.toFixed(0) === this.duration.toFixed(0)) {
      newState.elapsedTime = 0;
      this.player.seek(0);
    }
    this.setState(newState);
    this.startHideControlsTimer();
  };

  togglePauseState = () => {
    const {paused} = this.state;
    if (paused) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  };

  startHideControlsTimer = () => {
    this.hideControlsTimer = setTimeout(() => {
      this.animateControls(ANIMATION_DURATION, 0);
    }, 1250);
  };

  animateControls = (duration = ANIMATION_DURATION, toValue = 0) => {
    Animated.timing(this.controlsOpacity, {toValue, duration}).start();
  };

  clearHideControlsTimer = () => {
    clearTimeout(this.hideControlsTimer);
  };

  immediateShowControls = () => {
    this.clearHideControlsTimer();
    this.controlsOpacity.setValue(1);
  };
}

VideoPlayer.propTypes = {
  url: PropTypes.string,
  poster: PropTypes.string,
  hideDuration: PropTypes.bool,
  resizeMode: PropTypes.string,
  autoPlay: PropTypes.bool,
  paused: PropTypes.bool,
  videoInView: PropTypes.bool,
  maxHeight: PropTypes.number,
  width: PropTypes.number,
  ratio: PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object,
  ]),
  landscapeMode: PropTypes.bool,
  repeat: PropTypes.bool,
};

VideoPlayer.defaultProps = {
  autoPlay: false,
  paused: true,
  resizeMode: 'contain',
  repeat: false,
};

export default VideoPlayer;
