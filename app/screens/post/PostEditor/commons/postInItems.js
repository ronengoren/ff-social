import I18n from '../../../../infra/localization';
import {entityTypes, userRoleTypes} from '../../../../vars/enums';

const predefinedPostInIds = {
  my: 0,
  community: 1,
  nationality: 2,
};

const defaultPostIn = ({
  type,
  entityType,
  // id,
  community,
  roles,
  canPublishToNationalityGroup,
  nationalityGroupId,
} = {}) => {
  const selectedType = type || entityType;

  if (roles && roles.includes(userRoleTypes.REGIONAL_MANAGER)) {
    return communityPostIn({...community, isSelectionEnabled: false});
  }

  const isNationalPagePublisher =
    selectedType === entityTypes.PAGE && canPublishToNationalityGroup;
  // return {
  //   id: isNationalPagePublisher
  //     ? nationalityGroupId
  //     : id || predefinedPostInIds.my,
  //   name:
  //     selectedType !== entityTypes.USER
  //       ? I18n.t('post_editor.pickers.post_to.my_followers')
  //       : I18n.t('post_editor.pickers.post_to.my_friends'),
  //   entityType: isNationalPagePublisher
  //     ? entityTypes.NATIONALITY_GROUP
  //     : selectedType,
  //   extraProps: {
  //     icon: {
  //       name: selectedType !== entityTypes.USER ? 'user-friends' : 'users',
  //       weight: 'solid',
  //       size: 18,
  //     },
  //     withBorder: true,
  //   },
  // };
};

const communityPostIn = ({id, name, isSelectionEnabled = true} = {}) => ({
  // id: id || predefinedPostInIds.community,
  // name: `Community${name ? ` (${name})` : ''}`,
  // type: isSelectionEnabled ? entityTypes.COMMUNITY : 'specificCommunity',
  // entityType: entityTypes.COMMUNITY,
  // extraProps: {
  //   icon: {
  //     name: 'users',
  //     weight: 'solid',
  //     size: 18,
  //   },
  //   withBorder: true,
  // },
});

const nationalityPostIn = ({id, name} = {}) => ({
  // id,
  // name: `Nationality${name ? ` (${name})` : ''}`,
  // type: entityTypes.NATIONALITY_GROUP,
  // entityType: entityTypes.NATIONALITY_GROUP,
  // extraProps: {
  //   icon: {
  //     name: 'users',
  //     weight: 'solid',
  //     size: 18,
  //   },
  //   withBorder: true,
  // },
});

export {defaultPostIn, communityPostIn, nationalityPostIn};
