import {Platform, Alert} from 'react-native';
import Permissions from 'react-native-permissions';
import I18n from '../../infra/localization';
import {
  addSpaceOnCapitalsAndCapitalize,
  capitalize,
} from '../../infra/utils/stringUtils';

const responseTypes = Permissions.RESULTS;

class permissionsService {
  static types = {
    location: {
      type: Platform.select({
        ios: Permissions.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      }),
      name: 'location',
    },
    notification: {type: 'notification', name: 'notification'},
  };

  static async isPermitted(type) {
    let status;
    if (type === permissionsService.types.notification.type) {
      const result = await Permissions.checkNotifications();
      status = result && result.status;
    } else {
      status = await Permissions.check(type.type);
    }

    return status === responseTypes.GRANTED;
  }

  static async getPermissionStatus(type) {
    if (type === permissionsService.types.notification.type) {
      const result = await Permissions.checkNotifications();
      return result.status;
    } else {
      const result = await Permissions.check(type);
      return result;
    }
  }

  static async requestPermission(type) {
    let result;
    if (type === permissionsService.types.notification.type) {
      result = await Permissions.requestNotifications([
        'alert',
        'sound',
        'badge',
        'notificationCenter',
      ]);
    } else {
      result = await Permissions.request(type);
    }
    return result;
  }

  static popGoToSettingsModal({type, actionText, onPressCancel}) {
    const permissionText = I18n.t(`modals.settings.permission_types.${type}`, {
      defaultValue: addSpaceOnCapitalsAndCapitalize(type),
    });
    const buttons = [
      {
        text: I18n.t('modals.settings.dismiss_button'),
        style: 'cancel',
        onPress: onPressCancel,
      },
      {
        text: I18n.t('modals.settings.settings_button'),
        onPress: Permissions.openSettings,
        style: 'cancel',
      },
    ];
    const title = I18n.t('modals.settings.text', {permissionText, actionText});
    const message = I18n.t('modals.settings.with_go_to_setting_button_text', {
      permissionText,
      actionText,
    });
    Alert.alert(title, message, buttons);
  }

  static popPremissionNotAvailableModal({type}) {
    const permissionText = capitalize(
      I18n.t(`modals.settings.permission_types.${type}`, {
        defaultValue: addSpaceOnCapitalsAndCapitalize(type),
      }),
    );
    const title = I18n.t('modals.permission_restricted', {permissionText});
    Alert.alert(title);
  }

  static async requestPermissionConditionally(type, options = {}) {
    let status = await permissionsService.getPermissionStatus(type.type);

    switch (status) {
      case responseTypes.GRANTED:
        break;
      case responseTypes.DENIED:
        if (!options.requestOnlyUndetermined) {
          ({status} = await permissionsService.requestPermission(type.type));
        }
        break;
      case responseTypes.BLOCKED:
        if (!options.requestOnlyUndetermined) {
          permissionsService.popGoToSettingsModal({
            type: type.name,
            actionText: options.actionText,
            onPressCancel: options.onPressCancel,
          });
        }
        break;
      case responseTypes.UNAVAILABLE:
        if (!options.requestOnlyUndetermined) {
          permissionsService.popPremissionNotAvailableModal({type});
        }
        break;
      default:
        permissionsService.popGoToSettingsModal({
          type,
          actionText: options.actionText,
          onPressCancel: options.onPressCancel,
        });
    }

    return status === responseTypes.GRANTED;
  }
}

export default permissionsService;
