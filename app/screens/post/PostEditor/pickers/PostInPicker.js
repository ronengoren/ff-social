import React from 'react';
import PropTypes from 'prop-types';
import {entityTypes, groupType} from '/vars/enums';
import I18n from '../../../../infra/localization';
import {isSuperAdmin} from '../../../../infra/utils';
import {ListMenuModal} from '../../../../components/listMenu';
import {userScheme} from '../../../../schemas';
import {defaultPostIn, communityPostIn} from '../commons/postInItems';

const PostInPicker = ({
  postIn = {},
  publishAs,
  user,
  additionalContexts,
  onClose,
  onSelect,
}) => {
  const {id: userId} = user;
  const selectedIds =
    postIn && Object.keys(postIn) && Object.keys(postIn).length
      ? [postIn.id]
      : [0];

  const additionalItems = additionalContexts.map((context) => {
    const adjustedContext = {
      ...context,
      name: ` ${I18n.t('post_editor.pickers.post_to.my_entity', {
        entityName: I18n.t(`entity_type_to_name.${entityTypes.NEIGHBORHOOD}`),
      })} (${context.name})`,
    };
    return adjustedContext;
  });

  if (publishAs && publishAs.canPublishToNationalityGroup) {
    additionalItems.unshift(
      communityPostIn(
        postIn && postIn.entityType === entityTypes.COMMUNITY
          ? {...postIn}
          : {},
      ),
    );
  }

  if (isSuperAdmin(user) && publishAs.entityType === entityTypes.USER) {
    // additionalItems.unshift(nationalityPostIn(nationalityGroup)); // enable when backend supports showing where the post was posted.
  }

  additionalItems.unshift(defaultPostIn(publishAs));

  return (
    <ListMenuModal
      isSelectable
      closeOnClick
      selectedIds={selectedIds}
      onSelect={({data}) => {
        onSelect && onSelect({data});
      }}
      query={{
        reducerStatePath: 'groups.memberedInTypeGroup',
        apiQuery: {
          domain: 'groups',
          key: 'getMembered',
          params: {userId, groupType: groupType.GROUP},
        },
        extraTopComponentsData: additionalItems,
      }}
      onClose={() => {
        onClose && onClose();
      }}
    />
  );
};

PostInPicker.propTypes = {
  user: userScheme,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  postIn: PropTypes.object,
  publishAs: PropTypes.object,
  additionalContexts: PropTypes.array,
};

export default PostInPicker;
