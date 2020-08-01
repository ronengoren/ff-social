import React from 'react';
import I18n from '../../infra/localization';
import {StyleSheet, Modal} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { impersonate } from '/redux/auth/actions';
import {
  View,
  Text,
  TextButton,
  Avatar,
  ScrollView,
  Spinner,
  Video,
} from '../../components/basicComponents';
import {Screen} from '../../components';
import {flipFlopColors, flipFlopFonts, flipFlopFontsWeights} from '../../vars';
import {entityTypes} from '../../vars/enums';
import sounds from '../../assets/sounds/';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  connectedUsersListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 61,
    padding: 15,
    borderBottomColor: flipFlopColors.disabledGrey,
    borderBottomWidth: 1,
    backgroundColor: flipFlopColors.white,
  },
  connectedUsersListItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedUsersListItemThumbnail: {
    marginRight: 10,
  },
  connectedUsersListItemNameText: {
    maxWidth: 200,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 16,
    color: flipFlopColors.black,
  },
  connectedUsersCommunity: {
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: 0.19,
    color: flipFlopColors.b60,
  },
});

class ConnectedUsersList extends React.Component {
  state = {
    showModal: false,
    userToSpoof: null,
  };

  render() {
    const {showModal} = this.state;
    // const {
    //   connectedAccounts,
    //   isSoundEnabled,
    // } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <ScrollView>
          {/* {connectedAccounts.map((user) =>
            this.renderConnectedUserListItem(user),
          )} */}
        </ScrollView>
        <Modal
          animationType="fade"
          visible={showModal}
          onRequestClose={() => {}}>
          <Spinner size="large" />
          <Video
            source={sounds.profile.mario}
            rate={1.0}
            volume={1.0}
            autoPlay
            onEnd={this.performImpersonation}
          />
        </Modal>
      </View>
    );
  }

  performImpersonation = () => {
    // const { userToSpoof } = this.state;
    // this.setState({ showModal: false });
    // this.props.impersonate({ userId: userToSpoof.id });
  };

  renderConnectedUserListItem = (data) => {
    const communityName = data.contextData.community.name;
    return (
      <View
        style={styles.connectedUsersListItem}
        key={`connectedUsersListItem${data.id}`}>
        <View style={styles.connectedUsersListItemLeft}>
          <Avatar
            entityId={data.id}
            entityType={entityTypes.USER}
            themeColor={data.themeColor}
            thumbnail={data.media.thumbnail}
            name={data.name}
            style={styles.connectedUsersListItemThumbnail}
            size="small"
          />
          <View>
            <Text
              style={styles.connectedUsersListItemNameText}
              numberOfLines={1}>
              {data.name}
            </Text>
            <Text style={styles.connectedUsersCommunity} numberOfLines={1}>
              {communityName}
            </Text>
          </View>
        </View>
        <TextButton
          size="medium"
          secondary
          onPress={() => this.spoofSelectedUser(data)}>
          {I18n.t('profile.settings.connected_accounts.spoof')}
        </TextButton>
      </View>
    );
  };

  spoofSelectedUser = async (user) => {
    const {isSoundEnabled} = this.props.navigation.state.params;
    this.setState({showModal: true, userToSpoof: user}, () => {
      if (!isSoundEnabled) {
        this.performImpersonation();
      }
    });
  };
}

ConnectedUsersList.propTypes = {
  navigation: PropTypes.object,
  //   impersonate: PropTypes.func
};

const mapDispatchToProps = {};

ConnectedUsersList = connect(null, mapDispatchToProps)(ConnectedUsersList);
export default Screen()(ConnectedUsersList);
