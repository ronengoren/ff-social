import React from 'react';
import {StyleSheet, Dimensions, Platform, StatusBar, Text} from 'react-native';
import {flipFlopColors, uiConstants} from '../../vars';
import {Wrapper} from '../../components/onboarding';
import {Slider} from '../../components';
import {hasNotch} from '../../infra/utils/deviceUtils';
import JoinOrSignupBar from './JoinOrSignupBar';

import Slide from './Slide';
import {View, TranslatedText} from '../../components/basicComponents';

const NUMBER_OF_SLIDES = 3;
const SLIDER_MARGIN_TOP = hasNotch() ? 40 : 0;

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoPlay: true,
    };
  }
  render() {
    const {autoPlay} = this.state;
    const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
    const smallScreen =
      screenHeight <=
      uiConstants.NORMAL_DEVICE_HEIGHT +
        Platform.select({android: 100, ios: 0});

    return (
      <Wrapper style={styles.container}>
        <StatusBar translucent={false} barStyle="dark-content" />

        <Slider
          numberOfSlides={NUMBER_OF_SLIDES}
          autoPlay={autoPlay}
          style={styles.slider}
          showBullets
          sliderWidth={screenWidth}>
          {(slideProps) => [
            <Slide key={0} repeat slide={0} {...slideProps}>
              {/* <TranslatedText
                style={[
                  styles.subTitle,
                  smallScreen && styles.subTitleSmallScreen,
                ]}
                textStyle={[
                  styles.subTitleText,
                  smallScreen && styles.subTitleSmallScreen,
                ]}>
                {I18n.t('onboarding.welcome.slide1')}
              </TranslatedText> */}
            </Slide>,
            <Slide key={1} repeat slide={1} {...slideProps}>
              {/* <TranslatedText
                style={[
                  styles.subTitle,
                  smallScreen && styles.subTitleSmallScreen,
                ]}
                textStyle={[
                  styles.subTitleText,
                  smallScreen && styles.subTitleSmallScreen,
                ]}>
                {I18n.t('onboarding.welcome.slide2')}
              </TranslatedText> */}
            </Slide>,
            <Slide key={2} slide={2} {...slideProps}>
              {/* <TranslatedText
                style={[
                  styles.subTitle,
                  smallScreen && styles.subTitleSmallScreen,
                  styles.subTitle1,
                ]}
                textStyle={[
                  styles.subTitleText,
                  smallScreen && styles.subTitleSmallScreen,
                ]}>
                {I18n.t('onboarding.welcome.slide3')}
              </TranslatedText> */}
            </Slide>,
          ]}
        </Slider>
        <View style={styles.lowerSection}>
          <JoinOrSignupBar
            onClickSignIn={this.navigateToSignIn}
            onClickSignUp={this.navigateToSignUp}
          />
        </View>
      </Wrapper>
    );
  }
}

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT,
  },
  lowerSection: {
    paddingHorizontal: 15,
  },
  slider: {
    marginTop: SLIDER_MARGIN_TOP,
  },
  subTitle: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 30,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
  },
  subTitleText: {
    fontSize: 22,
    lineHeight: 26,
    color: flipFlopColors.b30,
  },
  subTitleSmallScreen: {
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 17,
    lineHeight: 22,
  },
  subTitle1: {
    paddingHorizontal: 15,
  },
});
