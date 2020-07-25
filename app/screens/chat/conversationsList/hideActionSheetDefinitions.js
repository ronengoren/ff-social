import I18n from '/infra/localization';
import {flipFlopColors} from '../../../vars';

const hideActionSheetDefintions = ({onHideConfirm}) => {
  const header = {
    text: I18n.t('communication_center.conversations.hide.confirm_title'),
  };
  const options = [
    {
      id: 'confirm',
      text: I18n.t('communication_center.conversations.hide.confirm_button'),
      shouldClose: true,
      action: onHideConfirm,
      color: flipFlopColors.red,
    },
  ];
  return {header, options, hasCancelButton: true};
};

export default hideActionSheetDefintions;
