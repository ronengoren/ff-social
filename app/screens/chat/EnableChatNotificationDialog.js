import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, Easing} from 'react-native';
import I18n from '../../infra/localization';
import EnableNotificationDialog from '../../screens/notifications/EnableNotificationDialog';
import {originTypes} from '../../vars/enums';

const NOTIFICATION_BANNER_HEIGHT = 120;

const styles = StyleSheet.create({
  notificationDialogWrapper: {
    width: '100%',
    zIndex: 1,
  },
});

let isNotificationBannerVisible = true;

function EnableChatNotificationDialog() {
  const marginTop = useRef(new Animated.Value(-NOTIFICATION_BANNER_HEIGHT))
    .current;
  const animateIn = () => {
    if (isNotificationBannerVisible) {
      Animated.timing(marginTop, {
        toValue: 0,
        duration: 1250,
        easing: Easing.inOut(Easing.exp),
      }).start();
    }
  };

  const hideTurnOnChatNotificationsDialog = () => {
    Animated.timing(marginTop, {
      toValue: -NOTIFICATION_BANNER_HEIGHT,
      duration: 500,
    }).start(() => {
      isNotificationBannerVisible = false;
    });
  };

  useEffect(() => {
    animateIn();
  }, []);

  return (
    <Animated.View style={[styles.notificationDialogWrapper, {marginTop}]}>
      <EnableNotificationDialog
        title={I18n.t('chat.turn_on_notifications_dialog.title')}
        subtitle={I18n.t('chat.turn_on_notifications_dialog.subtitle')}
        buttonText={I18n.t('chat.turn_on_notifications_dialog.buttonText')}
        isWithShadow
        isSmall
        isWithClose
        onShowNotificationsChange={(value) => {
          if (!value) {
            hideTurnOnChatNotificationsDialog();
          }
        }}
        onPressClose={hideTurnOnChatNotificationsDialog}
        originType={originTypes.CHAT_CONVERSATION}
      />
    </Animated.View>
  );
}

export default EnableChatNotificationDialog;
