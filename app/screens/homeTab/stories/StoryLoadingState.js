import React, {useEffect} from 'react';
import {StyleSheet, LayoutAnimation} from 'react-native';
import {View} from '../../../components/basicComponents';
import {flipFlopColors, commonStyles} from '../../../vars';
import StorySkeleton from './StorySkeleton';

const styles = StyleSheet.create({
  storyLoading: {
    paddingVertical: 5,
    marginRight: 5,
    backgroundColor: flipFlopColors.paleGreyFour,
    shadowOpacity: 0,
  },
  loadingBar: {
    height: 12,
    width: 135,
    backgroundColor: flipFlopColors.paleGreyFive,
    borderRadius: 8,
  },
  loadingBarSecond: {
    width: 100,
    marginTop: 10,
  },
});

function StoryLoadingState() {
  useEffect(
    () => () => {
      LayoutAnimation.easeInEaseOut();
    },
    [],
  );
  return (
    <View style={commonStyles.flexDirectionRow}>
      {Array.from({length: 5}, (item) => (
        <StorySkeleton
          style={styles.storyLoading}
          preTextComponent={<View key={1} style={styles.loadingBar} />}
          textComponent={
            <View style={[styles.loadingBar, styles.loadingBarSecond]} />
          }
        />
      ))}
    </View>
  );
}

export default StoryLoadingState;
