import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { finishedOnBoarding } from '/redux/auth/actions';
// import { register } from '/infra/pushNotifications';
// import { analytics } from '/infra/reporting';
import {View, Video, Text} from '../../components/basicComponents';
import {Screen} from '../../components';
import {flipFlopColors} from '../../vars';
import {uiConstants} from '../../vars/uiConstants';
import videos from '../../assets/videos';
import {SubmitButton} from '../../components/onboarding';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT + 30,
    backgroundColor: flipFlopColors.white,
  },
  containerSmallScreen: {
    paddingTop: uiConstants.PHONE_BAR_HEIGHT,
  },
  video: {
    alignSelf: 'center',
    width: 270,
    height: 233,
    marginBottom: 30,
  },
  lowerSection: {
    paddingBottom: 15 + uiConstants.FOOTER_MARGIN_BOTTOM,
    paddingHorizontal: 15,
  },
  title: {
    marginBottom: 5,
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
    color: flipFlopColors.black,
  },
  explanationText: {
    paddingHorizontal: 25,
    fontSize: 15,
    lineHeight: 25,
    textAlign: 'center',
    color: flipFlopColors.black,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  lowerSectionButtonsSeparator: {
    width: '100%',
    height: 10,
  },
  disallowNotifications: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: flipFlopColors.placeholderGrey,
  },
});

const AllowNotifications = ({user, finishedOnBoarding}) => {
  let processing;
  const {height} = Dimensions.get('window');
  const smallScreen = height <= uiConstants.NORMAL_DEVICE_HEIGHT;
  const allowPushNotifications = async () => {
    if (processing) {
      return;
    }
    analytics.actionEvents
      .onboardingEnableNotificationsPopup({userId: user.id, enabled: true})
      .dispatch();
    processing = true;
    await register(user.id);
    // finishedOnBoarding();
  };
  const dontAllowPushNotifications = () => {
    analytics.actionEvents
      .onboardingEnableNotificationsPopup({userId: user.id, enabled: false})
      .dispatch();
    // finishedOnBoarding();
  };
  return (
    <View
      style={[styles.container, smallScreen && styles.containerSmallScreen]}>
      <View style={styles.content}>
        <Video
          style={styles.video}
          source={videos.welcome.notification}
          onRef={(ref) => {
            this.player = ref;
          }}
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
        <Text style={styles.title} medium>
          {I18n.t('onboarding.allow_notifications.title')}
        </Text>
        <Text style={styles.explanationText}>
          {I18n.t('onboarding.allow_notifications.description')}
        </Text>
      </View>
      <View style={styles.lowerSection}>
        <SubmitButton
          isAbsolute={false}
          isDisabled={false}
          onPress={allowPushNotifications}
          label={I18n.t('onboarding.allow_notifications.approve_button')}
        />
        <View style={styles.lowerSectionButtonsSeparator} />
        <Text
          onPress={dontAllowPushNotifications}
          testID="disallowNotificationsButton"
          style={styles.disallowNotifications}>
          {I18n.t('onboarding.allow_notifications.decline_button')}
        </Text>
      </View>
    </View>
  );
};

AllowNotifications.propTypes = {
  user: PropTypes.object,
  //   finishedOnBoarding: PropTypes.func
};

const mapStateToProps = (state) => ({
  //   user: state.auth.user
});

const mapDispatchToProps = {
  //   finishedOnBoarding
};

const wrappedAllowNotifications = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AllowNotifications);
export default Screen({modalError: true})(wrappedAllowNotifications);
