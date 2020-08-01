import React from 'react';
import PropTypes from 'prop-types';
import {entityTypes, filterTypes} from '../../../../vars/enums';
import I18n from '../../../../infra/localization';
import {Filter} from '../../../../components/filters';

const CommunityPicker = ({applyFilter, closeFilter}) => {
  const applyCommunityFilter = ({community}) => {
    const {id, cityName} = community;
    applyFilter &&
      applyFilter({name: cityName, id, entityType: entityTypes.COMMUNITY});
  };

  return (
    <Filter
      filterType={filterTypes.COMMUNITY}
      actionButtonText={I18n.t(`filters.ok_button.select`)}
      applyFilter={applyCommunityFilter}
      closeFilter={() => {
        closeFilter && closeFilter();
      }}
    />
  );
};

CommunityPicker.propTypes = {
  applyFilter: PropTypes.func,
  closeFilter: PropTypes.func,
};

export default CommunityPicker;
