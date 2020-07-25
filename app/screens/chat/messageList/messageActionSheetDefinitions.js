import I18n from '../../../infra/localization';
import {flipFlopColors} from '../../../vars';

const messageActionSheetDefinition = ({
  hasText,
  onCopy,
  onHide,
  isDeleteMode,
  onHideConfirm,
}) => {
  if (isDeleteMode) {
    const header = {text: I18n.t('chat.delete_message_action_sheet.title')};
    const options = [
      {
        id: 'confirm',
        text: I18n.t('chat.delete_message_action_sheet.confirm'),
        shouldClose: true,
        action: onHideConfirm,
        color: flipFlopColors.red,
        testID: 'deleteMessageConfirm',
      },
    ];
    return {header, options, hasCancelButton: true};
  } else {
    const options = [
      {
        id: 'hide',
        text: I18n.t('chat.message_action_sheet.delete'),
        awesomeIconName: 'trash-alt',
        awesomeIconWeight: 'light',
        shouldClose: false,
        action: onHide,
        color: flipFlopColors.red,
        testID: 'deleteMessage',
      },
    ];

    if (hasText) {
      options.splice(0, 0, {
        id: 'copy',
        text: I18n.t('chat.message_action_sheet.copy'),
        awesomeIconName: 'copy',
        awesomeIconWeight: 'light',
        shouldClose: true,
        action: onCopy,
      });
    }

    return {
      options,
      hasCancelButton: true,
    };
  }
};

export default messageActionSheetDefinition;
