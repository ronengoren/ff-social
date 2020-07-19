import {Alert} from 'react-native';
import I18n from '../../infra/localization';

class ErrorModal {
  static showAlert = (headerText, bodyText, buttonText) => {
    Alert.alert(
      headerText || I18n.t('modals.error.title'),
      bodyText || I18n.t('modals.error.body'),
      [{text: buttonText || I18n.t('modals.error.button')}],
    );
  };
}

export default ErrorModal;
