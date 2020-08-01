import I18n from '../../infra/localization';
import {flipFlopColors} from '../../vars';

const commentActionSheetDefinition = (
  {
    // isAdmin,
    // isCommentOwner,
    // isTopEntityOwner,
    // onDelete,
    // onEdit,
    // onReport,
  },
) => {
  const options = [];

  // if (isCommentOwner) {
  //   options.push({
  //     id: 'edit',
  //     text: I18n.t('comment.action_sheets.edit'),
  //     iconName: 'edit',
  //     shouldClose: true,
  //     action: onEdit,
  //   });
  // } else {
  //   options.push({
  //     id: 'report',
  //     text: I18n.t('comment.action_sheets.report'),
  //     iconName: 'flag',
  //     shouldClose: false,
  //     action: onReport,
  //   });
  // }

  // if (isCommentOwner || isTopEntityOwner || isAdmin) {
  //   options.push({
  //     id: 'delete',
  //     text: I18n.t('comment.action_sheets.delete.button'),
  //     iconName: 'delete',
  //     shouldClose: false,
  //     action: onDelete,
  //     color: flipFlopColors.red,
  //   });
  // }

  // return {
  //   options,
  //   hasCancelButton: true,
  // };
};

export default commentActionSheetDefinition;
