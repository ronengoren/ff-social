import {Alert} from 'react-native';
import I18n from '../../infra/localization';

class AfterReportModal {
  static showAlert = () => {
    Alert.alert(
      I18n.t('modals.after_report.title'),
      I18n.t('modals.after_report.body'),
      [{text: I18n.t('modals.after_report.button')}],
    );
  };
}

export default AfterReportModal;
