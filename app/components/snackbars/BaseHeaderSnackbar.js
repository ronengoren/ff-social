import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TouchableOpacity, Animated, StatusBar, StyleSheet} from 'react-native';
import {IconButton} from '../basicComponents';
import {flipFlopColors, uiConstants} from '../../vars';

const {NAVBAR_HEIGHT, STATUS_BAR_HEIGHT} = uiConstants;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: flipFlopColors.white,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
    minHeight: NAVBAR_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
  },
});

class BaseHeaderSnackbar extends Component {
  state = {
    translateY: new Animated.Value(-9999),
    opacity: new Animated.Value(0),
  };

  render() {
    const {
      onPress,
      children,
      style,
      onClickClose,
      hideCloseButton,
    } = this.props;
    const {translateY, opacity} = this.state;

    return (
      <TouchableOpacity
        onLayout={this.onLayout}
        style={[styles.wrapper, style, {transform: [{translateY}]}]}
        activeOpacity={0.9}
        onPress={onPress}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={{opacity}}>{children}</Animated.View>
        {!hideCloseButton && (
          <IconButton
            style={[styles.closeIcon, {top: STATUS_BAR_HEIGHT - 5}]}
            name="close"
            onPress={onClickClose}
            iconColor="white"
          />
        )}
      </TouchableOpacity>
    );
  }

  componentDidUpdate(prevProps) {
    const {isVisible} = this.props;
    if (prevProps.isVisible && !isVisible) {
      Animated.stagger(150, [
        this.animateOpacity(0),
        this.animateTranslateY(this.viewHeight),
      ]).start();
    }

    if (!prevProps.isVisible && isVisible) {
      Animated.stagger(250, [
        this.animateTranslateY(0),
        this.animateOpacity(1),
      ]).start();
    }
  }

  onLayout = (e) => {
    const {isVisible} = this.props;
    const {nativeEvent} = e;
    const {layout} = nativeEvent;
    this.viewHeight = -layout.height;
    this.state.translateY.setValue(this.viewHeight);
    if (isVisible) {
      Animated.stagger(250, [
        this.animateTranslateY(0),
        this.animateOpacity(1),
      ]).start();
    }
  };

  animateOpacity = (toValue) =>
    Animated.spring(this.state.opacity, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    });
  animateTranslateY = (toValue) =>
    Animated.spring(this.state.translateY, {
      toValue,
      duration: 500,
      bounciness: 1,
      useNativeDriver: true,
    });
}

BaseHeaderSnackbar.propTypes = {
  onPress: PropTypes.func,
  isVisible: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  onClickClose: PropTypes.func,
  hideCloseButton: PropTypes.bool,
};

BaseHeaderSnackbar.defaultProps = {
  hideCloseButton: false,
};

export default BaseHeaderSnackbar;
