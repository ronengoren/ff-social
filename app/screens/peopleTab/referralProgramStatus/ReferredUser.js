import React, {Component} from 'react';
import {connect} from 'react-redux';
// import { inviteFriendRequest } from '/redux/friendships/actions';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {get} from '../../../infra/utils';
import {
  View,
  Text,
  Avatar,
  IconButton,
} from '../../../components/basicComponents';
import {
  entityTypes,
  friendshipStatusType,
  screenNames,
} from '../../../vars/enums';
import {flipFlopColors} from '../../../vars';
import {navigationService} from '../../../infra/navigation';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  containerBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 10,
  },
  icon: {
    width: 50,
    height: 34,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    borderRadius: 70,
  },
});

class ReferredUser extends Component {
  render() {
    const {user, hasBottomBorder} = this.props;
    return (
      <View
        key={user.id}
        style={[
          styles.container,
          hasBottomBorder && styles.containerBottomBorder,
        ]}>
        <View style={styles.userDetails}>
          <Avatar
            // entityId={user.id}
            entityType={entityTypes.USER}
            // themeColor={user.themeColor}
            // thumbnail={user.media.thumbnail}
            // name={user.name}
            style={styles.image}
            size="small1"
          />
          <Text size={16} color={flipFlopColors.b30} numberOfLines={1}>
            {user.name}
          </Text>
        </View>
        {this.renderUserButton(user)}
      </View>
    );
  }

  renderUserButton() {
    const {friendshipStatus} = this.props.user;
    if (friendshipStatus === friendshipStatusType.friends) {
      return (
        <IconButton
          name="comment"
          isAwesomeIcon
          weight="solid"
          iconSize={17}
          iconColor={flipFlopColors.b30}
          style={styles.icon}
          onPress={this.navigateToChat}
        />
      );
    }
    return (
      <IconButton
        name="add-friend"
        iconColor={flipFlopColors.b30}
        iconSize={23}
        style={styles.icon}
        onPress={this.addFriend}
      />
    );
  }

  navigateToChat = () => {
    // const {user} = this.props;
    // const participant = {
    //   participantId: user.id,
    //   participantName: user.name,
    //   participantAvatar: get(user, 'media.thumbnail'),
    // };
    // navigationService.navigate(screenNames.Chat, participant);
  };

  addFriend = () => {
    //     const { user, inviteFriendRequest } = this.props;
    //     const { id: userId, name: userName } = user;
    //     inviteFriendRequest({ userId, userName });
  };
}

ReferredUser.propTypes = {
  // user: PropTypes.object,
  hasBottomBorder: PropTypes.bool,
  //   inviteFriendRequest: PropTypes.func
};

export default connect(null)(ReferredUser);
