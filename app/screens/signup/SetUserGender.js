import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  BackHandler,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { analytics, Logger } from '/infra/reporting';
// import { updateProfile } from '/redux/profile/actions';
import {Text, View} from '../../components/basicComponents';
import {Screen} from '../../components';
import {isNil} from '../../infra/utils';
import {
  isHighDevice,
  isShortDevice,
  isAndroid,
} from '../../infra/utils/deviceUtils';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {genderType, screenNames} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import {
  misc as miscLocalStorage,
  user as userLocalStorage,
} from '../../infra/localStorage';
import {Wrapper, HeaderMedia, SubmitButton} from '../../components/onboarding';

import videos from '/assets/videos';
import {getFirstName} from '/infra/utils/stringUtils';

const supportedGenders = [genderType.MALE, genderType.FEMALE];
const MAX_BUTTON_SIZE = 125;
const BUTTONS_MARGIN = isHighDevice ? 28 : 35;
const BUTTONS_SIZE = (Dimensions.get('window').width - BUTTONS_MARGIN * 3) / 2;

const styles = StyleSheet.create({
  wrapperShortDevice: {
    paddingTop: 110,
  },
  media: {
    marginTop: 7,
  },
  mainContent: {
    flex: 1,
  },
  mainPadding: {
    marginHorizontal: 15,
  },
  genderCol: {
    maxWidth: MAX_BUTTON_SIZE,
    maxHeight: MAX_BUTTON_SIZE,
    width: BUTTONS_SIZE,
    height: BUTTONS_SIZE,
    borderRadius: 10,
    borderWidth: 1,
    paddingTop: 2,
    borderColor: flipFlopColors.lightPaleGrey,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  genderSelectors: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingTop: 11,
  },
  genderHeaderTitle: {
    fontSize: 32,
    lineHeight: 35,
    textAlign: 'center',
    marginBottom: 10,
  },
  genderHeader: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 42,
  },
  selectedGenderCol: {
    backgroundColor: flipFlopColors.green,
    borderWidth: 0,
  },
});

class SetUserGender extends React.Component {
  state = {
    selectedGender: null,
    bgOpacity: new Animated.Value(0),
    fieldsOpacity: new Animated.Value(0),
    translateY: new Animated.Value(-100),
    showError: false,
  };

  render() {
    const {fieldsOpacity, translateY, bgOpacity} = this.state;
    return (
      <Wrapper style={isShortDevice && styles.wrapperShortDevice}>
        <StatusBar translucent barStyle="dark-content" />
        {!isShortDevice && (
          <Animated.View style={[{opacity: bgOpacity}]}>
            <HeaderMedia
              videoSource={videos.onboarding.set_user_gender}
              wrapperStyle={styles.media}
            />
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.mainContent,
            {opacity: fieldsOpacity, transform: [{translateY}]},
          ]}>
          {this.renderGenderField()}
        </Animated.View>
        <View style={[styles.mainPadding]}>{this.renderNextButton()}</View>
      </Wrapper>
    );
  }

  componentDidMount() {
    this.animateContentFields();
    miscLocalStorage.update({
      onboardingPersistentScreen: screenNames.SetUserGender,
    });

    if (isAndroid) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.androidBackButtonListener,
      );
    }
  }

  componentWillUnmount() {
    if (isAndroid) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.androidBackButtonListener,
      );
    }
  }

  renderGenderField() {
    const {user} = this.props;
    const {selectedGender, showError} = this.state;
    // const {name} = user;
    return (
      <View>
        <Text style={styles.genderHeaderTitle} bolder>
          {I18n.t('onboarding.set_user_gender.title')}
          {/* {` ${getFirstName(name)}`} */}
        </Text>
        <Text
          style={[
            styles.genderHeader,
            {color: showError ? flipFlopColors.red : flipFlopColors.b30},
          ]}>
          {I18n.t('onboarding.set_user_gender.header')}
        </Text>

        <View style={styles.genderSelectors}>
          {supportedGenders.map((value) => {
            const isActive = selectedGender === value;
            return (
              <TouchableOpacity
                testID={`signupSetGender-${value}`}
                style={[styles.genderCol, isActive && styles.selectedGenderCol]}
                activeOpacity={0.5}
                key={`gender${value}`}
                onPress={this.setGender(value)}>
                <AwesomeIcon
                  style={styles.genderIcon}
                  name={value === genderType.MALE ? 'mars' : 'venus'}
                  weight="light"
                  color={isActive ? flipFlopColors.white : flipFlopColors.green}
                  size={50}
                />
                <Text
                  size={18}
                  color={isActive ? flipFlopColors.white : flipFlopColors.b30}>
                  {I18n.t(`profile.gender.${value}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  renderNextButton() {
    const {selectedGender} = this.state;
    const isDisabled = isNil(selectedGender) || this.isSubmitting;
    const onPress = isDisabled
      ? () => this.setState({showError: true})
      : this.next;
    return (
      <SubmitButton
        isAbsolute={false}
        onPress={onPress}
        testID="signupSetGenderSubmitButton"
        isDisabled={isDisabled}
      />
    );
  }

  animateContentFields = () => {
    const {translateY, fieldsOpacity, bgOpacity} = this.state;
    Animated.parallel([
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 750,
        delay: 750,
        useNativeDriver: true,
      }),
      Animated.timing(fieldsOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 750,
        useNativeDriver: true,
      }),
    ]).start();
  };

  androidBackButtonListener = () => this.props.navigation.isFocused();

  setGender = (gender) => () => {
    this.setState({selectedGender: gender, showError: false});
  };

  next = async () => {
    // const { user } = this.props;
    // const { selectedGender: gender } = this.state;
    // const newUserData = { ...user, gender };
    // if (this.isSubmitting) {
    //   return;
    // }
    // this.isSubmitting = true;
    // try {
    //   this.updateProfile(newUserData);
    //   this.isSubmitting = false;
    //   analytics.actionEvents.onboardingSetGender({ userId: user.id, gender }).dispatch();
    //   navigationService.navigate(screenNames.SetUserDetails);
    // } catch (err) {
    //   Logger.error({ message: 'failed to submit user gender form', gender, err });
    // }
    // this.isSubmitting = false;
  };

  async updateProfile(newUserData) {
    // const { user, updateProfile } = this.props;
    // try {
    //   const updatedUser = await updateProfile({ userId: user.id, delta: { ...newUserData } });
    //   userLocalStorage.update(updatedUser.user);
    // } catch (err) {
    //   Logger.error({ message: 'failed to update profile', delta: newUserData, err });
    // }
  }
}

SetUserGender.propTypes = {
  user: PropTypes.object,
  //   updateProfile: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({
  // user: state.auth.user,
});

const mapDispatchToProps = {
  //   updateProfile
};

SetUserGender = connect(mapStateToProps, mapDispatchToProps)(SetUserGender);
export default Screen({modalError: true})(SetUserGender);
