import React, {useState, useEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Keyboard, Animated, StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {useDispatch, useSelector} from 'react-redux';
// import { addToWaitingList as addToWaitingListAction } from '/redux/auth/actions';
// import { updateProfile } from '/redux/profile/actions';
import {useBackHandler} from '/hooks';
import {Text, View, ScrollView} from '../../components/basicComponents';
import {Screen, FormInput} from '../../components';
import {flipFlopColors, uiConstants, commonStyles} from '../../vars';
import {screenNames, originTypes} from '../../vars/enums';
import {isEmpty, get} from '../../infra/utils';
// import { analytics } from '/infra/reporting';
import {email as validateEmail} from '../../infra/utils/formValidations';
import videos from '../../assets/videos';
import {
  GoBackButton,
  HeaderMedia,
  CountriesIcons,
  SubmitButton,
} from '../../components/onboarding';
import {navigationService} from '../../infra/navigation';
import {getRelevantOnboardingScreen} from '../../infra/utils/onboardingUtils';
import {
  isHighDevice,
  isShortDevice,
  isAndroid,
} from '../../infra/utils/deviceUtils';
import {getCommunityTranslationByOriginAndDestination} from '../../infra/utils/communitiesNationalitiesUtils';
import {enhanceWithLayoutAnimations} from './getLayoutAnimations';
import SuggestedNationalities from './SuggestedNationalities';
import {Wrapper} from './components';
import {getCountryByCode} from './JoinCommunity/countries';

const styles = StyleSheet.create({
  container: {
    paddingTop:
      uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + isShortDevice ? 43 : 0,
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  mainPadding: {
    paddingHorizontal: 15,
  },
  headerMedia: {
    marginTop: 0,
    marginBottom: 0,
  },
  content: {
    flex: 1,
    marginTop: isHighDevice ? 0 : -10,
    backgroundColor: flipFlopColors.white,
  },
  contentForm: {
    justifyContent: isHighDevice ? 'center' : 'flex-start',
  },
  contentSuggested: {
    marginTop: 10,
  },
  upperPartCountries: {
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  title: {
    marginBottom: 15,
  },
  infoText: {
    marginBottom: 30,
  },
  suggestedNationalitiesText: {
    marginTop: 15,
  },
  formInput: {
    paddingTop: 0,
    borderColor: flipFlopColors.b90,
  },
});
const getAnimationCommonProps = ({
  opacity = 1,
  duration = 250,
  ...animationProps
} = {}) => ({
  toValue: opacity,
  duration,
  useNativeDriver: true,
  ...animationProps,
});

function getFadeInAnimations() {
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  const fadeIn = [
    Animated.timing(iconOpacity, getAnimationCommonProps()),
    Animated.timing(titleOpacity, getAnimationCommonProps()),
    Animated.parallel([
      Animated.timing(formOpacity, getAnimationCommonProps()),
      Animated.timing(contentOpacity, getAnimationCommonProps()),
    ]),
  ];

  const fadeOut = [
    Animated.timing(
      titleOpacity,
      getAnimationCommonProps({opacity: 0, duration: 250}),
    ),
    Animated.timing(
      formOpacity,
      getAnimationCommonProps({opacity: 0, duration: 250}),
    ),
    Animated.timing(
      contentOpacity,
      getAnimationCommonProps({opacity: 0, duration: 250}),
    ),
  ];

  return {
    fadeIn,
    fadeOut,
    iconOpacity,
    titleOpacity,
    formOpacity,
    contentOpacity,
  };
}

const sceneTypes = {
  FORM: 'form',
  ADD_TO_WAITING_LIST: 'submitted_waiting_list_form',
  SUGGESTED_NATIONALITIES: 'suggested_nationalities',
};

// Since we're doing lot of animations and logic in this page that acts 'like' three different screens, we keep tracking screenViews but using a fake screenName
const fakeScreenNamesBySceneType = {
  [sceneTypes.FORM]: screenNames.NoNationality,
  [sceneTypes.ADD_TO_WAITING_LIST]: 'AddToWaitingList',
  [sceneTypes.SUGGESTED_NATIONALITIES]: 'SuggestedNationalities',
};
let NoNationality = (props) => {
  // const {animationUtils, isKeyboardShown} = props;

  // const {btnY, contentY, androidInputY, messureMediaComponent} = animationUtils;

  const headerMedia = (
    <View>
      <HeaderMedia
        // videoSource={videoSource}
        wrapperStyle={styles.headerMedia}
      />
    </View>
  );
  const sceneProps = {
    [sceneTypes.FORM]: {
      title: <React.Fragment></React.Fragment>,
    },
  };
  return (
    <Wrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        // scrollEnabled={sceneTypes.SUGGESTED_NATIONALITIES}
        keyboardShouldPersistTaps="handled">
        <View style={styles.contentWrapper}>
          <Text>NoNationality</Text>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

NoNationality.propTypes = {
  // isKeyboardShown: PropTypes.bool,
  // animationUtils: PropTypes.object,
  // navigation: PropTypes.object,
};

export default React.memo(NoNationality);
