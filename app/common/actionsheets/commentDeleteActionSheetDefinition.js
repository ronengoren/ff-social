import I18n from '../../infra/localization';

const commentDeleteActionSheetDefinition = ({onDelete}) => {
  const header = {
    text: I18n.t('comment.action_sheets.delete.header'),
  };

  const options = [
    {
      id: 'delete',
      text: I18n.t('comment.action_sheets.delete.confirm'),
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

export default commentDeleteActionSheetDefinition;
