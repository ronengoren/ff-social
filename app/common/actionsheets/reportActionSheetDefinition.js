import {AfterReportModal} from '../../components/modals';
import I18n from '../../infra/localization';
import {reportTypes} from '../../vars/enums';

const reportActionSheetDefinition = ({
  entityType,
  entityId,
  reports = [reportTypes.SPAM, reportTypes.OFFENSIVE],
}) => ({apiCommand}) => {
  const sendReport = (reportType) => async () => {
    await apiCommand('reports.create', {
      entityType,
      entityId,
      reportType,
    });
    AfterReportModal.showAlert();
  };

  const options = [];

  if (reports.includes(reportTypes.SPAM)) {
    options.push({
      id: 'spam',
      text: I18n.t('posts.action_sheets.report.spam'),
      type: reportTypes.SPAM,
      iconName: 'delete',
      shouldClose: true,
      action: sendReport(reportTypes.SPAM),
    });
  }

  if (reports.includes(reportTypes.OFFENSIVE)) {
    options.push({
      id: 'inappropriate',
      text: I18n.t('posts.action_sheets.report.inappropriate'),
      type: reportTypes.OFFENSIVE,
      iconName: 'flag',
      shouldClose: true,
      action: sendReport(reportTypes.OFFENSIVE),
    });
  }

  if (reports.includes(reportTypes.BAD_CONTENT)) {
    options.push({
      id: 'lowQuality',
      text: I18n.t('posts.action_sheets.report.bad_content'),
      type: reportTypes.BAD_CONTENT,
      awesomeIconName: 'thumbs-down',
      shouldClose: true,
      action: sendReport(reportTypes.BAD_CONTENT),
    });
  }

  return {
    header: null,
    options,
    hasCancelButton: true,
  };
};

export default reportActionSheetDefinition;
