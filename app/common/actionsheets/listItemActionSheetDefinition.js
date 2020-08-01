import I18n from '../../infra/localization';
import {flipFlopColors} from '../../vars';

const listItemActionSheetDefinition = ({
  canEdit,
  onEdit,
  canDelete,
  onDelete,
  onToggleSave,
  isSaved,
}) => {
  const options = [
    {
      id: 'save-unsave',
      text: isSaved
        ? I18n.t('list.item.action_sheets.unsave')
        : I18n.t('list.item.action_sheets.save'),
      awesomeIconSize: 19,
      awesomeIconName: 'bookmark',
      shouldClose: true,
      action: onToggleSave,
    },
  ];

  if (canEdit) {
    options.push({
      id: 'edit',
      text: I18n.t('list.item.action_sheets.edit'),
      iconName: 'edit',
      shouldClose: true,
      action: onEdit,
    });
  }

  if (canDelete) {
    options.push({
      id: 'delete',
      text: I18n.t('list.item.action_sheets.delete.delete_button'),
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

export default listItemActionSheetDefinition;
