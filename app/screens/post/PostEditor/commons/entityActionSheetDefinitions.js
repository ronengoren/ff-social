import I18n from '../../../../infra/localization';

const actionSheetDefinition = ({onDelete}) => {
  const options = [
    {
      id: 'delete',
      text: I18n.t('post_editor.preview_section.action_sheets.delete_preview'),
      iconName: 'delete',
      shouldClose: true,
      action: onDelete,
    },
  ];

  return {
    options,
    hasCancelButton: true,
  };
};

export default actionSheetDefinition;
