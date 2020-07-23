import React, {Component} from 'react';
import I18n from '/infra/localization';
import PropTypes from 'prop-types';
import {relationshipType} from '../../vars/enums';
import {without} from '../../infra/utils';
import FilterRow from './FilterRow';

class RelationshipsFilters extends Component {
  render() {
    const {relationshipStatuses} = this.props;
    return without(
      Object.values(relationshipType),
      relationshipType.UNKOWN,
    ).map((value, index) => (
      <FilterRow
        key={value}
        action={this.handlePressed(value)}
        index={index}
        isActive={relationshipStatuses.includes(value)}
        text={I18n.t(`filters.relationshipStatuses.${value}`)}
      />
    ));
  }

  handlePressed = (relationshipType) => () => {
    const {onRelationshipsChanged, relationshipStatuses} = this.props;

    let newRelationship = relationshipStatuses;
    const friendshipIndex = newRelationship.findIndex(
      (item) => item === relationshipType,
    );
    if (friendshipIndex > -1) {
      newRelationship = [
        ...newRelationship.slice(0, friendshipIndex),
        ...newRelationship.slice(friendshipIndex + 1),
      ];
    } else {
      newRelationship = [...newRelationship, relationshipType];
    }

    onRelationshipsChanged(newRelationship);
  };
}

RelationshipsFilters.propTypes = {
  onRelationshipsChanged: PropTypes.func.isRequired,
  relationshipStatuses: PropTypes.array,
};

export default RelationshipsFilters;
