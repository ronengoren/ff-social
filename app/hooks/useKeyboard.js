import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

function useKeyboard() {
  const [coordinates, setCoordinates] = useState({height: 0, screenY: 0});
  const [isKeyboardShown, setKeyboardShown] = useState();

  function keyboardDidShow(e) {
    setKeyboardShown(true);
    setCoordinates(e.endCoordinates);
  }
  function keyboardDidHide(e) {
    setKeyboardShown(false);
    setCoordinates(e.endCoordinates);
  }

  useEffect(() => {
    const didShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    const didHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );
    return () => {
      didShowListener.remove();
      didHideListener.remove();
    };
  }, []);
  return {isKeyboardShown, keyboardHeight: coordinates.height};
}

export const enhanceWithUseKeyboard = (WrappedComponent) => (props) => {
  const {keyboardHeight, isKeyboardShown} = useKeyboard();
  return (
    <WrappedComponent
      {...props}
      keyboardHeight={keyboardHeight}
      isKeyboardShown={isKeyboardShown}
    />
  );
};

export default useKeyboard;
