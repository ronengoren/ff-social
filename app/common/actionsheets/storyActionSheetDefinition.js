import I18n from '../../infra/localization';
import {flipFlopColors} from '../../vars';

const storyActionSheetDefinition = ({onEdit, onDeactivate, onDelete}) => {
  const options = [];
  if (onEdit) {
    options.push({
      id: 'edit',
      text: I18n.t('stories.action_sheets.edit'),
      iconName: 'edit',
      shouldClose: true,
      action: onEdit,
    });
  }

  if (onDeactivate) {
    options.push({
      id: 'deactivate',
      text: I18n.t('stories.action_sheets.deactivate'),
      awesomeIconName: 'toggle-off',
      awesomeIconWeight: 'solid',
      shouldClose: true,
      action: onDeactivate,
    });
  }

  if (onDelete) {
    options.push({
      id: 'delete',
      text: I18n.t('stories.action_sheets.delete'),
      iconName: 'delete',
      shouldClose: false,
      action: onDelete,
      color: flipFlopColors.red,
    });
  }

  return {
    options,
    hasCancelButton: true,
  };
};

const storyDeleteActionSheetDefinition = ({onDelete}) => {
  const header = {
    text: I18n.t('stories.action_sheets.delete_title'),
  };

  const options = [
    {
      id: 'delete',
      text: I18n.t('stories.action_sheets.delete_confirm'),
      shouldClose: true,
      action: onDelete,
    },
  ];

  return {
    header,
    options,
    hasCancelButton: true,
  };
};

export {storyActionSheetDefinition, storyDeleteActionSheetDefinition};
