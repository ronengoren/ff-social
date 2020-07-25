import React from 'react';
import I18n from '../../infra/localization';
import {StyleSheet, FlatList, StatusBar, View} from 'react-native';
import {NavigationEvents} from 'react-navigation';

import {Screen} from '../../components';
import {flipFlopColors, uiConstants} from '../../vars';
import {hasNotch} from '../../infra/utils/deviceUtils';
import {isRTL} from '../../infra/utils/stringUtils';
import {navigationService} from '../../infra/navigation';
import {screenNames} from '../../vars/enums';
import SolutionsBoardsAndTags from '../solutionsTab/SolutionsBoardsAndTags';

import SolutionsTabMainHeader from './lobby/SolutionsTabMainHeader';
import SolutionsTabHeaderSearch from './lobby/SolutionsTabHeaderSearch';
import BaseHeader from './lobby/Header';
import {HEADER_PADDING_FROM_TOP_WITH_NOTCH} from './utils';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: flipFlopColors.white,
    paddingTop: hasNotch() ? HEADER_PADDING_FROM_TOP_WITH_NOTCH : 0, // Must have it here so the search header wont overflow the notch when scrolling,
  },
  containerRTL: {
    direction: 'rtl',
  },
  content: {
    paddingBottom: uiConstants.BOTTOM_TAB_BAR_HEIGHT,
  },
});

const headerDimenssions = {};
const HeaderComponent = React.memo(() => (
  <SolutionsTabMainHeader
    onLayout={(e) => {
      const {width, height, x, y} = e.nativeEvent.layout;
      Object.assign(headerDimenssions, {width, height, x, y});
    }}
  />
));
const toggleStatusBar = (isVisible) => StatusBar.setHidden(!isVisible, 'fade');
const adjustStatusBarColor = (e) => {
  const {y} = e.nativeEvent.contentOffset;
  const showStatusBar = y <= headerDimenssions.height - 150;
  toggleStatusBar(showStatusBar);
};

const navigateToSearch = () => {
  // navigationService.navigate(screenNames.Search, { isWithSavedTerms: false });
};

const SolutionsHomeContent = [
  <BaseHeader>
    <SolutionsTabHeaderSearch onPressSearchBox={navigateToSearch} />
  </BaseHeader>,
  SolutionsBoardsAndTags,
];
function SolutionsHome() {
  const isRtlDesign = isRTL(I18n.t('solutions.lobby.title'));

  return (
    <React.Fragment>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor={flipFlopColors.transparent}
      />
      <NavigationEvents onDidBlur={() => toggleStatusBar(true)} />
      <FlatList
        onScroll={adjustStatusBarColor}
        style={[styles.container, isRtlDesign && styles.containerRTL]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={HeaderComponent}
        data={React.Children.toArray(SolutionsHomeContent)}
        stickyHeaderIndices={[1]}
        keyExtractor={(i, index) => `content-${index}`}
        renderItem={({item: ItemComponent}) => ItemComponent}
      />
    </React.Fragment>
  );
}

export default SolutionsHome;
