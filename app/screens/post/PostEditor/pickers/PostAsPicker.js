import React from 'react';
import PropTypes from 'prop-types';
import {entityTypes} from '../../../../vars/enums';
import {ListMenuModal} from '../../../../components/listMenu';
import {userScheme} from '../../../../schemas';

const PostAsPicker = ({user, selectedIds, onClose, onSelect, headerText}) => {
  // const {name, id, media: {thumbnail} = {}, roles, userType, community} = user;
  // const ownEntity = {
  //   id,
  //   name,
  //   media: {thumbnail},
  //   type: entityTypes.USER,
  //   roles,
  //   userType,
  //   community,
  // };
  return (
    <ListMenuModal
      isSubmitVisible={false}
      isHeaderShown={!!headerText}
      headerText={headerText}
      isSelectable
      closeOnClick
      selectedIds={selectedIds}
      onClose={() => {
        onClose && onClose();
      }}
      onSelect={({data}) => {
        onSelect && onSelect({data});
      }}
      // query={{
      //   reducerStatePath: 'pages.owned',
      //   apiQuery: {domain: 'pages', key: 'getOwned', params: {userId: id}},
      //   extraTopComponentsData: [ownEntity],
      // }}
    />
  );
};

PostAsPicker.propTypes = {
  user: userScheme,
  selectedIds: PropTypes.array,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  headerText: PropTypes.string,
};

export default PostAsPicker;
