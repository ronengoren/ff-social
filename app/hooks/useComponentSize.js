import {useState, useCallback} from 'react';

function useComponentSize() {
  const [size, setSize] = useState();
  const onLayout = useCallback((event) => {
    const {width, height, x, y} = event.nativeEvent.layout;
    setSize({width, height, x, y});
  }, []);

  return [size, onLayout];
}

export default useComponentSize;
