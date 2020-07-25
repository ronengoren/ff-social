import {useRef, useEffect} from 'react';
import {Animated} from 'react-native';

function useAnimation({
  initialValue,
  delay,
  value,
  duration,
  useNativeDriver = true,
}) {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      delay,
      useNativeDriver,
    }).start();
  }, [value]);

  return animatedValue;
}

export default useAnimation;
