import React, {useState, useRef, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Image, View, Video} from '../../components/basicComponents';
import videos from '../../assets/videos';
import {get, isEmpty} from '../../infra/utils';
import {
  uiConstants,
  flipFlopColors,
  commonStyles,
  flipFlopFontsWeights,
} from '../../vars';
import {useBackHandler} from '/hooks';
import {Screen, ItemErrorBoundary} from '../../components';
import {navigationService} from '../../infra/navigation';
import {getRelevantOnboardingScreen} from '../../infra/utils/onboardingUtils';
import {screenNames} from '../../vars/enums';
import {getCountryImageByCode} from './JoinCommunity/countries';
import {Wrapper, JoinNationalityTitle} from './components';

const ICON_SIZE = 40;

const {width} = Dimensions.get('window');
const VIDEO_RATIO = 1.3186813186813187;

const LEFT_ICON_CENTERED_POSITION = width / 2 - ICON_SIZE - 10;
const RIGHT_ICON_CENTERED_POSITION = -width / 2 + ICON_SIZE + 10;

const INITIAL_ANIMATION_DELAY = 500;
const DELAY_BEFORE_SHOWING_ICONS = 150;
const DELAY_BEFORE_SHOWING_TITLE = 150;
const DELAY_BEFORE_NAVIGATE_TO_SIGNUP = 1300;

const commonAnimationProps = {
  toValue: 1,
  easing: Easing.linear,
  duration: 250,
  useNativeDriver: true,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.white,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
  },
  mainPadding: {
    marginHorizontal: 15,
  },
  mainContent: {
    flex: 1,
    marginBottom: 50,
    justifyContent: 'center',
  },
  video: {
    width,
    height: width / VIDEO_RATIO,
  },
  countriesIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  countryIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE,
  },
  title: {
    opacity: 0,
    maxWidth: width - 32,
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    color: flipFlopColors.b60,
    fontSize: 32,
    lineHeight: 44,
  },
  smallText: {
    fontSize: 24,
    lineHeight: 32,
  },
  numbers: {
    fontWeight: flipFlopFontsWeights.bold,
    color: flipFlopColors.green,
  },
});

function OriginDestinationCountryIcons({
  afterIconsShown,
  showIcons,
  matchedNationality,
  originCountry,
}) {
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showIcons) {
      Animated.sequence([
        Animated.delay(DELAY_BEFORE_SHOWING_ICONS),
        Animated.stagger(0, [
          Animated.timing(iconOpacity, commonAnimationProps),
          Animated.timing(translateX, commonAnimationProps),
        ]),
      ]).start(afterIconsShown);
    }
  }, [showIcons]);

  const {destinationNumericCountryCode} = matchedNationality;

  const iconSources = {
    left: getCountryImageByCode(get(originCountry, 'countryCode')),
    right: getCountryImageByCode(destinationNumericCountryCode),
  };

  const iconAnimationInterpolation = {
    left: translateX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, LEFT_ICON_CENTERED_POSITION],
    }),
    right: translateX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, RIGHT_ICON_CENTERED_POSITION],
    }),
  };

  return (
    <View style={styles.countriesIconWrapper}>
      {['left', 'right'].map((position) => (
        <Animated.View
          key={position}
          style={{
            opacity: iconOpacity,
            transform: [{translateX: iconAnimationInterpolation[position]}],
          }}>
          <Image
            style={styles.countryIcon}
            source={{uri: iconSources[position]}}
          />
        </Animated.View>
      ))}
    </View>
  );
}

OriginDestinationCountryIcons.propTypes = {
  showIcons: PropTypes.bool,
  afterIconsShown: PropTypes.func,
  matchedNationality: PropTypes.object,
  originCountry: PropTypes.shape({
    countryCode: PropTypes.number,
  }),
};

let ContinueWithNationality = ({navigation}) => {
  const user = useSelector((state) => state.auth.user);
  const matchedNationality = get(navigation, 'state.params.matchedNationality');
  const hasMatchedNationality = !isEmpty(matchedNationality);
  const suggestedNationalities =
    get(navigation, 'state.params.suggestedNationalities') || [];
  const originCountry = get(navigation, 'state.params.originCountry');
  const destinationCountry = get(navigation, 'state.params.destinationCountry');

  const nationality = matchedNationality || {};
  if (!hasMatchedNationality) {
    nationality.originNumericCountryCodes = [originCountry.countryCode];
    nationality.destinationNumericCountryCode = destinationCountry.countryCode;
    nationality.originNativesName = originCountry.name;
    nationality.destinationCountryName = destinationCountry.name;
    nationality.isDummy = true;
  }

  const handleBackPress = useCallback(() => navigation.isFocused(), [
    navigation,
  ]);
  useBackHandler(handleBackPress);

  const videoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(INITIAL_ANIMATION_DELAY),
      Animated.timing(videoOpacity, commonAnimationProps),
    ]).start(() => {
      setShowIcons(true);
    });
  }, []);

  const afterCountriesIconsShown = () => {
    Animated.sequence([
      Animated.delay(DELAY_BEFORE_SHOWING_TITLE),
      Animated.timing(titleOpacity, commonAnimationProps),
      Animated.delay(DELAY_BEFORE_NAVIGATE_TO_SIGNUP),
    ]).start(() => {
      if (user) {
        const nextScreen = getRelevantOnboardingScreen({
          user,
          matchedNationality,
          suggestedNationalities,
        });
        navigationService.navigate(nextScreen, {
          suggestedNationalities,
          matchedNationality,
          nationality,
          originCountry,
          destinationCountry,
        });
      } else {
        navigationService.navigate(screenNames.SignUpMethods, {
          suggestedNationalities,
          matchedNationality,
          nationality,
          originCountry,
          destinationCountry,
        });
      }
    });
  };

  return (
    <Wrapper>
      <View style={[styles.container, commonStyles.flex1]}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <Animated.View style={{opacity: videoOpacity}}>
          <Video
            style={styles.video}
            source={videos.onboarding.connect_with_nationality}
            rate={1.0}
            volume={0}
            muted
            paused={false}
            resizeMode="contain"
            repeat
            progressUpdateInterval={10000}
            onLoadStart={null}
            onLoad={null}
            onProgress={null}
            onEnd={null}
            onError={null}
          />
        </Animated.View>

        <View style={[styles.mainContent, styles.mainPadding]}>
          <ItemErrorBoundary boundaryName="OnboardingCountriesIcons">
            <OriginDestinationCountryIcons
              showIcons={showIcons}
              afterIconsShown={afterCountriesIconsShown}
              matchedNationality={nationality}
              originCountry={originCountry}
            />
          </ItemErrorBoundary>
          <Animated.View style={[styles.title, {opacity: titleOpacity}]}>
            <JoinNationalityTitle
              nationality={nationality}
              originCountry={originCountry}
              destinationCountry={destinationCountry}
              translationKey="continue_with_nationality_screen"
              smallTextStyle={[styles.text, styles.smallText]}
              textStyle={styles.text}
              smallNumbersStyle={[
                styles.text,
                styles.smallText,
                styles.numbers,
              ]}
              numbersStyle={[styles.text, styles.numbers]}
            />
          </Animated.View>
        </View>
      </View>
    </Wrapper>
  );
};

ContinueWithNationality.propTypes = {
  navigation: PropTypes.object,
};

ContinueWithNationality = Screen({modalError: true})(ContinueWithNationality);

export default React.memo(ContinueWithNationality);
