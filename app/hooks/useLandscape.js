import {useState, useEffect} from 'react';
import Orientation from 'react-native-orientation';
import {orientationTypes} from '../vars/enums';

function useLandscape() {
  const [landscapeMode, setLandscapeMode] = useState(false);

  const orientationDidChange = (orientation) => {
    if (orientation === orientationTypes.LANDSCAPE) {
      setLandscapeMode(true);
    } else if (orientation === orientationTypes.PORTRAIT_UPSIDE_DOWN) {
      // in this orientation we force portrait view programmatically and then immediately cancel lock
      Orientation.lockToPortrait();
      Orientation.unlockAllOrientations();
      setLandscapeMode(false);
    } else {
      setLandscapeMode(false);
    }
  };

  const didChange = () => {
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(orientationDidChange);
  };

  const willUnmount = () => {
    Orientation.lockToPortrait();
    Orientation.removeOrientationListener(orientationDidChange);
  };

  useEffect(() => {
    didChange();
    return willUnmount;
  }, []);

  return landscapeMode;
}

export default useLandscape;
