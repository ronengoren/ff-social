import React from 'react';
import {Animated, TouchableOpacity, StyleSheet} from 'react-native';
import {View, ScrollView} from '../../../components/basicComponents';

import {flipFlopColors} from '../../../vars';
import {solutionScheme} from '../../../schemas/common';
import {AwesomeIcon} from '../../../assets/icons';
import {useAnimation} from '/hooks';
import {navigationService} from '../../../infra/navigation';
import {screenNames} from '../../../vars/enums';
import {hasNotch} from '../../../infra/utils/deviceUtils';
import SearchTag from './SearchTag';

const HIT_SLOP = {left: 20, right: 10, top: 10, bottom: 10};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingTop: hasNotch() ? 50 : 30,
    paddingHorizontal: 15,
  },
  goBack: {
    marginRight: 10,
  },
});

const animatedProps = {toValue: 0, duration: 150, useNativeDriver: true};
function ResultsHeaderChips({solution}) {
  // const {tagName, name, parent} = solution;
  const opacityMap = [
    useAnimation({initialValue: 0, value: 1}),
    // useAnimation({initialValue: 0, value: parent ? 1 : 0}),
  ];

  const goBackToHome = () => {
    // const animations = [Animated.timing(opacityMap[0], animatedProps)];
    // if (parent) {
    //   animations.unshift(Animated.timing(opacityMap[1], animatedProps));
    // }
    // Animated.sequence(animations).start(() => {
    //   if (parent) {
    //     navigationService.resetToScreen(screenNames.SolutionsHome);
    //   } else {
    //     navigationService.goBack();
    //   }
    // });
  };

  const goBackToTree = () =>
    Animated.timing(opacityMap[1], animatedProps).start(() => {
      navigationService.goBack();
    });

  // const onPressCancel = parent ? goBackToTree : goBackToHome;
  // const chips = [{text: name || tagName, onPressCancel}];

  // if (parent) {
  //   const {name: text} = parent;
  //   chips.unshift({text, onPressCancel: goBackToHome});
  // }

  return (
    <View style={styles.header}>
      <Animated.View style={{opacity: opacityMap[0]}}>
        <TouchableOpacity
          accessibilityTraits="button"
          accessibilityComponentType="button"
          activeOpacity={1}
          // onPress={onPressCancel}
          style={[styles.goBack]}
          hitSlop={HIT_SLOP}>
          <AwesomeIcon
            name="chevron-left"
            size={21}
            weight="solid"
            color={flipFlopColors.green}
          />
        </TouchableOpacity>
      </Animated.View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Animated.View
          // key={text}
          horizontal>
          <SearchTag />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

ResultsHeaderChips.propTypes = {
  solution: solutionScheme,
};

export default ResultsHeaderChips;
