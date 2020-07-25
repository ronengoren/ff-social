import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

import I18n from '../../../infra/localization';
import {View, Text} from '../../../components/basicComponents';
import {flipFlopColors, commonStyles} from '../../../vars';
import {AwesomeIcon} from '../../../assets/icons';
import {compact, get} from '../../../infra/utils';
import {hasNotch, isHighDevice} from '../../../infra/utils/deviceUtils';
import {navigationService} from '../../../infra/navigation';
import {screenNames} from '../../../vars/enums';

import TypewriteText, {useTyping} from './TypewriteText';

const SEARCH_BAR_HEIGHT = 55;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: hasNotch() ? 20 : 25,
    marginHorizontal: 15,
    marginBottom: isHighDevice ? 15 : 0,
  },
  rtlWrapper: {
    flexDirection: 'row-reverse',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: SEARCH_BAR_HEIGHT,
    marginEnd: 10,
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    borderWidth: 1,
    borderColor: flipFlopColors.b70,
  },
  searchBoxRTL: {
    flexDirection: 'row-reverse',
  },
  searchBoxIcon: {
    marginRight: 10,
  },
  searchBoxIconRTL: {
    marginLeft: 10,
  },
  savedItemsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: flipFlopColors.paleGreyFour,
  },
  activeSavedItemsWrapper: {
    backgroundColor: flipFlopColors.green,
  },
  badgeWrapper: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: flipFlopColors.white,
    borderRadius: 14,
    width: 30,
    height: 20,
    shadowColor: flipFlopColors.green,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 4,
  },
  textBlinker: {
    marginLeft: -2,
  },
});

const TypingStateComponent = (
  <Text size={22} style={styles.textBlinker} color={flipFlopColors.b70}>
    |
  </Text>
);

function SolutionsTabHeaderSearch(props) {
  // const savedThemes = useSelector((state) => get(state, 'themes.savedThemes'));
  // const numOfSavedItems = savedThemes.reduce(
  //   (acc, item) => acc + item.total,
  //   0,
  // );
  const typingDefinitions = compact(
    I18n.t('solutions.lobby.search_placeholders'),
  );
  const {typingState, currentTypingText, handleTypings} = useTyping({
    textDefinitions: typingDefinitions,
    repeats: 1,
  });
  const {isRtlDesign, onPressSearchBox} = props;

  return (
    <View style={[styles.wrapper, isRtlDesign && styles.rtlWrapper]}>
      <TouchableOpacity
        onPress={onPressSearchBox}
        activeOpacity={0.8}
        style={[
          styles.searchBox,
          commonStyles.shadow,
          isRtlDesign && styles.searchBoxRTL,
        ]}>
        <AwesomeIcon
          name="search"
          size={20}
          color={flipFlopColors.b30}
          style={isRtlDesign ? styles.searchBoxIconRTL : styles.searchBoxIcon}
          weight="solid"
        />
        <TypewriteText
          TextComponent={Text}
          exactDelay={80}
          onTypingEnd={handleTypings}
          typing={typingState}
          size={18}
          color={flipFlopColors.b70}
          BlinkingCharComponent={typingState ? TypingStateComponent : null}>
          {currentTypingText.trim()}
        </TypewriteText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.savedItemsWrapper,
          // !!numOfSavedItems && styles.activeSavedItemsWrapper,
        ]}
        // onPress={() =>
        //   navigationService.navigate(screenNames.SavedItemsView, {
        //     numOfSavedItems,
        //   })
        // }
      >
        <AwesomeIcon
          name="bookmark"
          size={20}
          color={flipFlopColors.b30}
          weight="solid"
        />
        {/* {numOfSavedItems > 0 && ( */}
        <View style={styles.badgeWrapper}>
          <Text size={11} color={flipFlopColors.green} bold center>
            {/* {numOfSavedItems} */}
          </Text>
        </View>
        {/* )} */}
      </TouchableOpacity>
    </View>
  );
}

SolutionsTabHeaderSearch.defaultProps = {
  isRtlDesign: false,
};

SolutionsTabHeaderSearch.propTypes = {
  onPressSearchBox: PropTypes.func,
  isRtlDesign: PropTypes.bool,
};

export default SolutionsTabHeaderSearch;
