import React, {useEffect} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {Screen} from '/components';
import {ScrollView, View, Text} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';
import {get, isEmpty} from '../../infra/utils';
import {screenNames, originTypes, solutionTypes} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import {useAnimation} from '/hooks';
// import { analytics } from '/infra/reporting';

import TagView from './common/TagView';
import {getOnPressBySolutionType, getSolutionDataForAnalytics} from './utils';
import ResultsSuggestions from './results/ResultsSuggestions';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: flipFlopColors.white,
  },
  tagsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    paddingTop: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  paddingHorizontal15: {
    paddingHorizontal: 15,
  },
});

const fireSolutionResultEvent = (solution) => {
  //   const origin = navigationService.getPrevScreenName();
  //   const currentScreenName = screenNames.SolutionsResults;
  //   const event = analytics.viewEvents.screenView({
  //     screenName: currentScreenName,
  //     origin,
  //     originType: originTypes.SOLUTIONS_TAB,
  //     extraData: getSolutionDataForAnalytics(solution)
  //   });
  //   event.dispatch();
};

function SolutionResults(props) {
  const solution = get(props, 'navigation.state.params', {});
  const {connectionQuestion, solutionChildren} = solution;
  const isTag = solution.solutionType === solutionTypes.TAG;
  const isTree = solution.solutionType === solutionTypes.TREE;
  const contentOpacity = useAnimation({
    initialValue: 0,
    value: 1,
    delay: 250,
    duration: 250,
  });

  useEffect(() => {
    !isEmpty(solution) && fireSolutionResultEvent(solution);
  }, [solution]);

  if (isEmpty(solution)) {
    navigationService.resetToScreen(screenNames.SolutionsHome);
  }

  const contents = [];
  if (isTree && !isEmpty(connectionQuestion)) {
    contents.push(
      <Text
        size={22}
        lineHeight={24}
        color={flipFlopColors.b30}
        bold
        style={styles.title}>
        {connectionQuestion}
      </Text>,
    );
  }

  if (isTree && !isEmpty(solutionChildren)) {
    const onPressTagView = (child) => () =>
      getOnPressBySolutionType({
        child,
        onPressTag: () =>
          navigationService.navigate(screenNames.SolutionsResults, {
            parent: solution,
            ...child,
          }),
      });
    contents.push(
      <ScrollView
        contentContainerStyle={[styles.tagsView, styles.paddingHorizontal15]}>
        {solutionChildren.map((child) => (
          <TagView
            key={child.id || child.name || child.tag}
            item={child}
            onPress={onPressTagView(child)}
          />
        ))}
      </ScrollView>,
    );
  }

  if (isTag) {
    contents.push(<ResultsSuggestions solution={solution} />);
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, {opacity: contentOpacity}]}>
        {React.Children.toArray(contents)}
      </Animated.View>
    </View>
  );
}

const SolutionResultsScreen = Screen({modalError: true})(SolutionResults);
export default SolutionResultsScreen;
