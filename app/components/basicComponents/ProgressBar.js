import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Animated} from 'react-native';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  progressBarWrapper: {
    width: '100%',
    height: 6,
    borderRadius: 1,
    backgroundColor: flipFlopColors.disabledGrey,
  },
  progressBar: {
    height: 6,
    borderRadius: 1,
  },
});

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progressBarWidth: new Animated.Value(props.initialProgress),
    };
  }
  render() {
    const {style, color} = this.props;
    const {progressBarWidth} = this.state;
    const progressBarActualWidth = progressBarWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
    return (
      <View style={[styles.progressBarWrapper, style]}>
        <Animated.View
          style={[
            styles.progressBar,
            {width: progressBarActualWidth, backgroundColor: color},
          ]}
        />
      </View>
    );
  }

  componentDidUpdate() {
    Animated.timing(this.state.progressBarWidth, {
      toValue: this.props.progress,
      duration: 300,
    }).start();
  }
}

ProgressBar.defaultProps = {
  initialProgress: 0,
  color: flipFlopColors.azure,
};

ProgressBar.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  color: PropTypes.string,
  initialProgress: PropTypes.number,
  progress: PropTypes.number,
};

export default ProgressBar;
