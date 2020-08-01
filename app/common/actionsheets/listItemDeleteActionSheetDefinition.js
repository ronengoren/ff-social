import I18n from '../../infra/localization';

const listItemDeleteActionSheetDefinition = ({onDelete}) => {
  const header = {
    text: I18n.t('list.item.action_sheets.delete.header'),
  };

  const options = [
    {
      id: 'delete',
      text: I18n.t('list.item.action_sheets.delete.confirm'),
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

export default listItemDeleteActionSheetDefinition;
