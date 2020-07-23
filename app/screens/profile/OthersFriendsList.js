import React from 'react';
import I18n from '/infra/localization';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {InfiniteScroll, Screen, SubHeader} from '../../components';
import {
  UserEntityComponent,
  UserEntityLoadingState,
} from '../../components/entity';
import {View} from '../../components/basicComponents';
import {get} from '../../infra/utils';
import {flipFlopColors, commonStyles} from '../../vars';
import {screenNames} from '../../vars/enums';

class OthersFriendsList extends React.Component {
  static subTabs = {
    MUTUAL_FRIENDS: 'Mutual',
    ALL_FRIENDS: 'All Friends',
  };

  getMutualFriendsApiQuery = {
    domain: 'friendships',
    key: 'mutual',
    params: {id: this.props.userProfileId},
  };
  getAllFriendsApiQuery = {
    domain: 'friendships',
    key: 'friends',
    params: {userId: this.props.userProfileId},
  };

  constructor(props) {
    super(props);
    const {subTab} = get(this.props, 'navigation.state.params', {});
    this.state = {
      activeTab: subTab || OthersFriendsList.subTabs.MUTUAL_FRIENDS,
    };
  }

  render() {
    const {hideSubHeader} = get(this.props, 'navigation.state.params', {});
    const {activeTab} = this.state;
    return (
      <View style={commonStyles.flex1}>
        {!hideSubHeader && (
          <SubHeader
            tabs={[
              {
                name: I18n.t('profile.others_friends_list.sub_tabs.sub_tab_1'),
                value: OthersFriendsList.subTabs.MUTUAL_FRIENDS,
              },
              {
                name: I18n.t('profile.others_friends_list.sub_tabs.sub_tab_2'),
                value: OthersFriendsList.subTabs.ALL_FRIENDS,
              },
            ]}
            screenName={screenNames.OthersFriendsList}
            activeTab={this.state.activeTab}
            onTabChange={(val) => this.setState({activeTab: val})}
            activeUnderlineColor={flipFlopColors.green}
            fullWidth
          />
        )}
        <View style={commonStyles.flex1}>
          {activeTab === OthersFriendsList.subTabs.MUTUAL_FRIENDS && (
            <InfiniteScroll
              reducerStatePath="friendships.mutual"
              apiQuery={this.getMutualFriendsApiQuery}
              ListItemComponent={UserEntityComponent}
              ListLoadingComponent={<UserEntityLoadingState />}
            />
          )}
          {activeTab === OthersFriendsList.subTabs.ALL_FRIENDS && (
            <InfiniteScroll
              reducerStatePath="friendships.friends"
              apiQuery={this.getAllFriendsApiQuery}
              ListItemComponent={UserEntityComponent}
              ListLoadingComponent={<UserEntityLoadingState />}
            />
          )}
        </View>
      </View>
    );
  }
}

OthersFriendsList.propTypes = {
  // eslint-disable-next-line Prop,react/no-unused-prop-types
  navigation: PropTypes.object,
  userProfileId: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const userProfileId = ownProps.navigation.state.params.entityId;
  return {
    friendshipRequests: state.friendships.requests,
    userProfileId,
  };
};

OthersFriendsList = connect(mapStateToProps)(OthersFriendsList);
export default Screen()(OthersFriendsList);
