import React, {useEffect, useRef} from 'react';
import {Platform, Animated} from 'react-native';
import {useKeyboard, useComponentSize} from '/hooks';

const isAndroid = Platform.OS === 'android';
const animationCommonProps = {
  toValue: 1,
  duration: 350,
  useNativeDriver: true,
};

function getAnimationUtils(options, keyboardHeight) {
  const {
    initialMediaOpacity = 1,
    initialContentY = 0,
    initialAndroidInputY = 0,
    initialButtonY = 0,
  } = options || {};
  const mediaOpacity = useRef(new Animated.Value(initialMediaOpacity)).current;
  const contentY = useRef(new Animated.Value(initialContentY)).current;
  const androidInputY = useRef(new Animated.Value(initialAndroidInputY))
    .current;
  const btnY = useRef(new Animated.Value(initialButtonY)).current;

  const getKeyboardHiddenAnimation = () =>
    Animated.parallel([
      Animated.timing(contentY, {...animationCommonProps, toValue: 0}),
      Animated.timing(mediaOpacity, {
        ...animationCommonProps,
        duration: 500,
        toValue: 1,
      }),
      isAndroid
        ? null
        : Animated.timing(btnY, {...animationCommonProps, toValue: 0}),
      isAndroid
        ? Animated.timing(androidInputY, {...animationCommonProps, toValue: 0})
        : null,
    ]);

  const getKeyboardShownAnimation = () =>
    Animated.parallel([
      Animated.timing(contentY, {
        ...animationCommonProps,
        toValue: -(size.height - 8),
      }),
      Animated.timing(mediaOpacity, {...animationCommonProps, toValue: 0}),
      // TODO- better to change messure method to offset Y from top so we can pick any container
      isAndroid
        ? null
        : Animated.timing(btnY, {
            ...animationCommonProps,
            toValue: -keyboardHeight,
          }),
      isAndroid
        ? Animated.timing(androidInputY, {
            ...animationCommonProps,
            toValue: -30,
          })
        : null,
    ]);

  const [size, messureMediaComponent] = useComponentSize();

  return {
    messureMediaComponent,
    getKeyboardHiddenAnimation,
    getKeyboardShownAnimation,
    mediaOpacity,
    contentY,
    androidInputY,
    btnY,
  };
}

export const enhanceWithLayoutAnimations = (options) => (WrappedComponent) => (
  props,
) => {
  const {keyboardHeight, isKeyboardShown} = useKeyboard();
  const animationUtils = getAnimationUtils(options, keyboardHeight);
  useEffect(() => {
    if (isKeyboardShown) {
      animationUtils.getKeyboardShownAnimation().start();
    } else {
      animationUtils.getKeyboardHiddenAnimation().start();
    }
  }, [isKeyboardShown, keyboardHeight]);

  return (
    <WrappedComponent
      {...props}
      animationUtils={animationUtils}
      keyboardHeight={keyboardHeight}
      isKeyboardShown={isKeyboardShown}
    />
  );
};

export default getAnimationUtils;
