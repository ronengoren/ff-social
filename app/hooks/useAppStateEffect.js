import {useState, useEffect} from 'react';
import {AppState} from 'react-native';

function useAppStateEffect(onChange) {
  const [appState, setAppState] = useState(AppState.currentState);

  const handleAppStateChanged = (newAppState) => {
    setAppState((prevAppState) => {
      onChange({prevAppState, appState: newAppState});
      return newAppState;
    });
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChanged);
    return () => {
      AppState.removeEventListener('change', handleAppStateChanged);
    };
  }, []);

  return {appState};
}

export default useAppStateEffect;
