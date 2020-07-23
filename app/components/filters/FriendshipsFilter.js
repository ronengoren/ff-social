import React, {Component} from 'react';
import I18n from '../../infra/localization';
import PropTypes from 'prop-types';
import {friendshipStatusType} from '../../vars/enums';
import FilterRow from './FilterRow';

class FriendshipsFilter extends Component {
  render() {
    const {friendshipStatuses} = this.props;
    return [
      <FilterRow
        key={friendshipStatusType.NOT_FRIENDS}
        action={this.handlePressed(friendshipStatusType.NOT_FRIENDS)}
        index={0}
        isActive={friendshipStatuses.includes(friendshipStatusType.NOT_FRIENDS)}
        text={I18n.t('filters.friendshipStatuses.0')}
      />,
      <FilterRow
        key={friendshipStatusType.FRIENDS}
        action={this.handlePressed(friendshipStatusType.FRIENDS)}
        index={1}
        isActive={friendshipStatuses.includes(friendshipStatusType.FRIENDS)}
        text={I18n.t('filters.friendshipStatuses.1')}
      />,
    ];
  }

  handlePressed = (friendshipType) => () => {
    const {onFriendshipsChanged, friendshipStatuses} = this.props;

    let newFriendships = friendshipStatuses;
    const friendshipIndex = newFriendships.findIndex(
      (item) => item === friendshipType,
    );

    if (friendshipIndex > -1) {
      newFriendships = [
        ...newFriendships.slice(0, friendshipIndex),
        ...newFriendships.slice(friendshipIndex + 1),
      ];
    } else {
      newFriendships = [...newFriendships, friendshipType];
    }

    onFriendshipsChanged(newFriendships);
  };
}

FriendshipsFilter.propTypes = {
  friendshipStatuses: PropTypes.array,
  onFriendshipsChanged: PropTypes.func.isRequired,
};

export default FriendshipsFilter;
