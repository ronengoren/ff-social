import React, {forwardRef, useRef, useImperativeHandle} from 'react';
import {StyleSheet} from 'react-native';
import {InfiniteScroll} from '../../../components';
import {View} from '../../../components/basicComponents';
import Story from './Story';
import StoryLoadingState from './StoryLoadingState';

const styles = StyleSheet.create({
  edgeSeparator: {
    marginRight: 15,
  },
});

function StoriesCarousel(props, ref) {
  const refFeed = useRef();

  useImperativeHandle(ref, () => ({
    refresh: refFeed.current.fetchTop,
  }));

  return (
    <InfiniteScroll
      ref={refFeed}
      reducerStatePath="stories"
      // apiQuery={{domain: 'stories', key: 'getStories'}}
      ListItemComponent={Story}
      ListLoadingComponent={<StoryLoadingState />}
      horizontal
      extraBottomComponent={<View style={styles.edgeSeparator} />}
    />
  );
}

export default forwardRef(StoriesCarousel);
