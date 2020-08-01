import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, Platform} from 'react-native';
// import { inviteFriendRequest } from '/redux/friendships/actions';
import I18n from '../../infra/localization';
import {Text} from '/components/basicComponents';
import {friendshipStatusType, postTypes} from '../../vars/enums';
import {isRTL} from '../../infra/utils/stringUtils';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  addFriend: {
    fontSize: 12,
    lineHeight: 17,
  },
  addFriendRTL: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: Platform.OS === 'ios' ? 3 : 1,
  },
});

class PostHeaderAddFriendButton extends React.Component {
  state = {
    requested:
      this.props.friendshipStatus === friendshipStatusType.REQUEST_SENT,
  };

  render() {
    const {postType, friendshipStatus} = this.props;
    const {requested} = this.state;
    const isFriendshipDeclinded =
      friendshipStatus === friendshipStatusType.REJECTED;
    const text =
      requested || isFriendshipDeclinded
        ? I18n.t('feed.post_header.friendship_button.pending')
        : I18n.t('feed.post_header.friendship_button.add_friend');
    const color =
      requested || isFriendshipDeclinded
        ? flipFlopColors.b60
        : flipFlopColors.green;
    if (postType === postTypes.SHARE) {
      return null;
    }
    const isRTLText = isRTL(text);
    return (
      <Text
        style={isRTLText ? styles.addFriendRTL : styles.addFriend}
        onPress={isFriendshipDeclinded ? null : this.toggleFriendshipRequest}
        color={color}>
        {text}
      </Text>
    );
  }

  toggleFriendshipRequest = () => {
    //     const { apiCommand, userId, userName, inviteFriendRequest } = this.props;
    //     const { requested } = this.state;
    //     this.setState({ requested: !requested });
    //     if (!requested) {
    //       inviteFriendRequest({ userId, userName });
    //     } else {
    //       apiCommand('friendships.unfriend', { toId: userId });
    //     }
  };
}

PostHeaderAddFriendButton.propTypes = {
  friendshipStatus: PropTypes.oneOf(Object.values(friendshipStatusType)),
  postType: PropTypes.oneOf(Object.values(postTypes)),
  apiCommand: PropTypes.func,
  // inviteFriendRequest: PropTypes.func,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default connect(null)(PostHeaderAddFriendButton);
