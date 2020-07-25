import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {get} from '../../infra/utils';
import I18n from '../../infra/localization';
// import * as pushManager from '/infra/pushNotifications';
import permissionsService from '../../infra/permissions/permissionsService';
import {
  View,
  Text,
  TextButton,
  IconButton,
} from '../../components/basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {useAppStateEffect} from '../../hooks';
import {stylesScheme} from '../../schemas';
import {isRTL} from '../../infra/utils/stringUtils';
import {originTypes} from '../../vars/enums';
// import { analytics } from '/infra/reporting';

const CLOSE_HIT_SLOP = {top: 15, left: 15, bottom: 15, right: 15};
const styles = StyleSheet.create({
  notificationsCta: {
    backgroundColor: flipFlopColors.white,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  shadowContainer: {
    ...commonStyles.shadow,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  notificationsCtaSmall: {
    paddingTop: 15,
  },
  ctaTextWrapper: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: flipFlopColors.b30,
  },
  ctaTitleSmall: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 0,
  },
  ctaText: {
    color: flipFlopColors.b30,
    textAlign: 'center',
    fontSize: 15,
  },
  ctaTextSmall: {
    fontSize: 13,
  },
  ctaButton: {
    marginTop: 10,
    marginBottom: 20,
    ...commonStyles.greenBtnShadow,
  },
  ctaButtonSmall: {
    marginTop: 6,
    marginBottom: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    end: 10,
  },
});

function EnableNotificationDialog({
  style,
  title,
  subtitle,
  buttonText,
  isWithClose,
  isWithShadow,
  isSmall,
  onShowNotificationsChange,
  onPressClose,
  originType,
}) {
  const user = useSelector((state) => get(state, 'auth.user'));
  const [isVisible, setIsVisible] = useState(false);

  const updateVisible = (value) => {
    setIsVisible(value);
    onShowNotificationsChange(value);
  };

  const updateNotificationsEnabled = async ({forcePopup}) => {
    if (forcePopup) {
      //   analytics.actionEvents.clickOnEnableNotificationsPopup({ userId: user.id, originType }).dispatch();
    }
    const isNotificationsEnabled = await permissionsService.requestPermissionConditionally(
      permissionsService.types.notification,
      {
        actionText: I18n.t(
          'communication_center.notifications.notifications_permission_reason',
        ),
        requestOnlyUndetermined: !forcePopup,
      },
    );

    if (isNotificationsEnabled) {
      registerNotifications();
    } else {
      updateVisible(true);
    }
  };

  const registerNotifications = async () => {
    // const pushToken = await pushManager.getPushToken();
    // if (pushToken) {
    //   updateVisible(false);
    // } else {
    //   const newPushToken = await pushManager.register(user);
    //   if (newPushToken && isVisible) {
    //     updateVisible(false);
    //   }
    // }
  };

  useEffect(() => {
    updateNotificationsEnabled({forcePopup: false});
  }, []);

  useAppStateEffect(({prevAppState, appState}) => {
    if (prevAppState.match(/inactive|background/) && appState === 'active') {
      updateNotificationsEnabled({forcePopup: false});
    }
  });
  const translatedTitle =
    title ||
    I18n.t(
      'communication_center.notifications.turn_on_notifications_cta.header',
    );
  const isRTLText = isRTL(translatedTitle);

  return (
    isVisible && (
      <View
        style={[
          styles.notificationsCta,
          isSmall && styles.notificationsCtaSmall,
          isWithShadow && styles.shadowContainer,
          isRTLText && styles.rtlContainer,
          style,
        ]}>
        <View style={styles.ctaTextWrapper}>
          <Text bold style={[styles.ctaTitle, isSmall && styles.ctaTitleSmall]}>
            {translatedTitle}
          </Text>
          <Text style={[styles.ctaText, isSmall && styles.ctaTextSmall]}>
            {subtitle ||
              I18n.t(
                'communication_center.notifications.turn_on_notifications_cta.text',
              )}
          </Text>
          <TextButton
            size="large"
            style={[styles.ctaButton, isSmall && styles.ctaButtonSmall]}
            onPress={() => updateNotificationsEnabled({forcePopup: true})}>
            {buttonText ||
              I18n.t(
                'communication_center.notifications.turn_on_notifications_cta.button',
              )}
          </TextButton>
        </View>
        {isWithClose && (
          <View style={styles.closeButton} activeOpacity={0.5}>
            <IconButton
              hitSlop={CLOSE_HIT_SLOP}
              size="small"
              iconSize={13}
              name="close"
              iconColor="b60"
              onPress={onPressClose}
            />
          </View>
        )}
      </View>
    )
  );
}

EnableNotificationDialog.defaultProps = {
  isWithShadow: false,
  isWithClose: false,
  isSmall: false,
  onShowNotificationsChange: () => {},
  onPressClose: () => {},
};

EnableNotificationDialog.propTypes = {
  style: stylesScheme,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string,
  isWithShadow: PropTypes.bool,
  isSmall: PropTypes.bool,
  onShowNotificationsChange: PropTypes.func,
  onPressClose: PropTypes.func,
};

export default EnableNotificationDialog;
