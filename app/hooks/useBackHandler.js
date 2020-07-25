import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {isAndroid} from '../infra/utils/deviceUtils';

function useBackHandler(cb) {
  useEffect(() => {
    if (isAndroid) {
      BackHandler.addEventListener('hardwareBackPress', cb);
    }
    return () => {
      if (isAndroid) {
        BackHandler.removeEventListener('hardwareBackPress', cb);
      }
    };
  });
}

export default useBackHandler;
