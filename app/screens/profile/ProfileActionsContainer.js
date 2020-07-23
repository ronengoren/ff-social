import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
// import { openActionSheet } from '/redux/general/actions';
import {get} from '../../infra/utils';
// import { inviteFriendRequest, approveFriendRequest, declineFriendRequest } from '/redux/friendships/actions';
import {IconButton, Text} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';
import {friendshipStatusType} from '../../vars/enums';
import {TouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.realBlack40,
    minWidth: 45,
    height: 45,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: flipFlopColors.white60,
    marginRight: 15,
  },
  actionButtonWithTextMargin: {
    marginLeft: 10,
  },
  actionText: {
    marginRight: 15,
  },
  actionTextWithoutIcon: {
    marginHorizontal: 15,
  },
});

const ProfileActionsContainer = ({
  isViewingOwnProfile,
  handleSettingsPress,
  requestFriendship,
  respondToRequest,
  cancelFriendshipRequest,
  unFriend,
  user,
}) => {
  const friendshipStatus = get(user, 'friendshipStatus');
  const status = {
    friends: friendshipStatus === friendshipStatusType.FRIENDS,
    requestedFriendship: friendshipStatus === friendshipStatusType.REQUEST_SENT,
    receivedFriendshipRequest:
      friendshipStatus === friendshipStatusType.REQUEST_RECEIVED,
    declinedFriendship: friendshipStatus === friendshipStatusType.REJECTED,
  };

  const shouldRenderAddFriendButton =
    !status.receivedFriendshipRequest &&
    !status.requestedFriendship &&
    !status.friends &&
    !status.declinedFriendship;

  if (isViewingOwnProfile) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.actionButton}
        onPress={handleSettingsPress}
        testID="profileMoreButton">
        <IconButton name="more" iconSize={25} iconColor="white" />
      </TouchableOpacity>
    );
  }
  return (
    <React.Fragment>
      {status.friends && (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.actionButton}
          onPress={unFriend}>
          <IconButton name="friends-" iconSize={25} iconColor="white" />
        </TouchableOpacity>
      )}
      {(status.requestedFriendship || status.declinedFriendship) && (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.actionButton}
          onPress={status.declinedFriendship ? null : cancelFriendshipRequest}>
          <Text
            size={15}
            style={styles.actionTextWithoutIcon}
            color={flipFlopColors.b60}>
            {I18n.t('common.buttons.request_sent')}
          </Text>
        </TouchableOpacity>
      )}
      {status.receivedFriendshipRequest && (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.actionButton}
          onPress={respondToRequest}>
          <IconButton
            name="friends-"
            iconSize={25}
            iconColor="white"
            style={styles.actionButtonWithTextMargin}
          />
          <Text
            size={15}
            style={styles.actionText}
            color={flipFlopColors.white}>
            {I18n.t('common.buttons.respond')}
          </Text>
        </TouchableOpacity>
      )}
      {shouldRenderAddFriendButton && (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.actionButton}
          onPress={requestFriendship}>
          <IconButton
            name="add-friend"
            iconSize={25}
            iconColor="white"
            style={styles.actionButtonWithTextMargin}
          />
          <Text
            size={15}
            style={styles.actionText}
            color={flipFlopColors.white}>
            {I18n.t('user_entity_component.add_button')}
          </Text>
        </TouchableOpacity>
      )}
    </React.Fragment>
  );
};

ProfileActionsContainer.propTypes = {
  user: PropTypes.object,
  respondToRequest: PropTypes.func,
  requestFriendship: PropTypes.func,
  cancelFriendshipRequest: PropTypes.func,
  isViewingOwnProfile: PropTypes.bool,
  handleSettingsPress: PropTypes.func,
  unFriend: PropTypes.func,
};

const mapDispatchToProps = {
  //   openActionSheet,
  //   inviteFriendRequest,
  //   approveFriendRequest,
  //   declineFriendRequest
};

export default connect(null, mapDispatchToProps)(ProfileActionsContainer);
