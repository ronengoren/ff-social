import React from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {flipFlopColors, uiConstants} from '../../vars';

const ANIMATION_TIME = 200;
const INNER_SPACE_WIDTH = 22;

const styles = StyleSheet.create({
  wrapper: {
    height: 24,
    width: 45,
  },
  rtlWrapper: {
    direction: 'rtl',
  },
  innerWrapper: {
    height: 24,
    width: 45,
    padding: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: flipFlopColors.placeholderGrey,
    backgroundColor: flipFlopColors.white,
  },
  thumb: {
    position: 'absolute',
    top: 2,
    left: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 18,
    width: 18,
    borderRadius: 15,
    backgroundColor: flipFlopColors.placeholderGrey,
  },
});

class Switch extends React.Component {
  constructor(props) {
    super(props);
    const initialValue = props.active ? 1 : 0;
    this.innerSpaceWidth = props.forceRTL
      ? -INNER_SPACE_WIDTH
      : INNER_SPACE_WIDTH;
    this.state = {
      active: props.active,
      position: new Animated.Value(props.active ? this.innerSpaceWidth : 0),
      borderColor: new Animated.Value(initialValue),
      backgroundColor: new Animated.Value(initialValue),
      thumbBackgroundColor: new Animated.Value(initialValue),
    };
  }

  render() {
    const {enableSwitch, activeColor, forceRTL} = this.props;
    const borderColor = this.state.borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: [flipFlopColors.placeholderGrey, activeColor],
    });
    const backgroundColor = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: [flipFlopColors.white, activeColor],
    });
    const thumbBackgroundColor = this.state.thumbBackgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: [flipFlopColors.placeholderGrey, flipFlopColors.white],
    });
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={enableSwitch && this.toggleSwitch}
        style={[styles.wrapper, forceRTL && styles.rtlWrapper]}
        hitSlop={uiConstants.BTN_HITSLOP}>
        <Animated.View
          style={[styles.innerWrapper, {borderColor, backgroundColor}]}>
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor: thumbBackgroundColor,
                transform: [{translateX: this.state.position}],
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  toggleSwitch = () => {
    const {onPress} = this.props;
    onPress && onPress();
    Animated.parallel([
      Animated.timing(this.state.position, {
        toValue: !this.state.active ? this.innerSpaceWidth : 0,
        duration: ANIMATION_TIME,
      }),
      Animated.timing(this.state.borderColor, {
        toValue: !this.state.active ? 1 : 0,
        duration: ANIMATION_TIME,
      }),
      Animated.timing(this.state.backgroundColor, {
        toValue: !this.state.active ? 1 : 0,
        duration: ANIMATION_TIME,
      }),
      Animated.timing(this.state.thumbBackgroundColor, {
        toValue: !this.state.active ? 1 : 0,
        duration: ANIMATION_TIME,
      }),
    ]).start(this.changeState);
  };

  changeState = (animationState) => {
    const {finished} = animationState;
    if (finished) {
      this.setState({active: !this.state.active});
      this.props.onChange(this.state.active);
    }
  };
}

Switch.propTypes = {
  forceRTL: PropTypes.bool,
  active: PropTypes.bool,
  enableSwitch: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  activeColor: PropTypes.string,
  onPress: PropTypes.func,
};

Switch.defaultProps = {
  active: false,
  enableSwitch: true,
  activeColor: flipFlopColors.green,
};

export default Switch;
