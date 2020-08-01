import React from 'react';
import PropTypes from 'prop-types';
import {Platform, StyleSheet, LayoutAnimation} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { approveFriendRequest, declineFriendRequest } from '/redux/friendships/actions';
import {EntityListsView} from '../../components';
import {GenericEmptyState} from '../../components/emptyState';
import {
  UserEntityComponent,
  UserEntityLoadingState,
} from '../../components/entity';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {originTypes} from '../../vars/enums';
import {get} from '../../infra/utils';
import {stylesScheme} from '../../schemas';
import FriendshipRequestComponent from './FriendshipRequestComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  firstInRow: {
    marginLeft: 15,
  },
  subHeader: {
    marginTop: 20,
  },
});

class FriendsList extends React.Component {
  constructor(props) {
    super(props);

    this.topSectionListProps = {
      reducerStatePath: 'friendships.requests',
      apiQuery: {domain: 'friendships', key: 'requests', params: {}},
      EntityComponent: this.renderFriendshipRequestComponent,
    };
  }

  render() {
    const {
      additionalHeaderComponent,
      headerStyle,
      onScroll,
      floatingHeader,
      friendRequestsNumber,
      hideTopSection,
      additionalBottomComponent,
    } = this.props;

    const topSectionSubHeaderProps = {
      leftText: I18n.t('people.sub_tabs.sub_tab_2'),
      badge: friendRequestsNumber,
      badgeColor: flipFlopColors.pinkishRed,
      style: styles.subHeader,
    };

    const bottomSectionListProps = this.getBottomSectionListProps();

    return (
      <View style={styles.container}>
        <EntityListsView
          ref={(node) => {
            this.entityListsView = node;
          }}
          topSectionSubHeaderProps={!hideTopSection && topSectionSubHeaderProps}
          topSectionListProps={!hideTopSection && this.topSectionListProps}
          bottomSectionListProps={bottomSectionListProps}
          componentColor={flipFlopColors.pinkishRed}
          additionalHeaderComponent={additionalHeaderComponent}
          headerStyle={headerStyle}
          onScroll={onScroll}
          listFooterComponent={additionalBottomComponent}
        />
        {floatingHeader}
      </View>
    );
  }

  renderFriendshipRequestComponent = ({data, index}) => (
    <FriendshipRequestComponent
      data={data}
      key={data.id}
      style={!index && styles.firstInRow}
      onFriendshipRequestApproval={this.onFriendshipRequestApproval}
      onFriendshipRequestDecline={this.onFriendshipRequestDecline}
    />
  );

  onFriendshipRequestApproval = async ({approvedUser}) => {
    // const { approveFriendRequest } = this.props;
    // const { id, name } = approvedUser;
    // if (Platform.OS === 'ios') {
    //   LayoutAnimation.easeInEaseOut();
    // }
    // approveFriendRequest({ userId: id, name });
  };

  onFriendshipRequestDecline = async ({declinedUser}) => {
    const {declineFriendRequest} = this.props;
    const {id, name} = declinedUser;
    if (Platform.OS === 'ios') {
      LayoutAnimation.easeInEaseOut();
    }
    declineFriendRequest({userId: id, name});
  };

  getBottomSectionListProps = () => {
    const {filters} = this.props;
    // const {community} = filters;
    const staticBottomSectionListProps = {
      listItemProps: {
        originType: originTypes.DISCOVER,
        disableLocationNavigation: true,
      },
      ListItemComponent: UserEntityComponent,
      listLoadingComponent: <UserEntityLoadingState />,
      listEmptyState: (
        <GenericEmptyState
          iconName="cat"
          isFlipFlopIcon={false}
          headerText={I18n.t('empty_states.users.header')}
          bodyText={I18n.t('empty_states.users.body')}
        />
      ),
    };

    const isFiltersEmpty =
      !filters || Object.values(filters).every((filterValue) => !filterValue);

    if (filters && !isFiltersEmpty) {
      return {
        ...staticBottomSectionListProps,
        reducerStatePath: 'users.results',
        apiQuery: {
          domain: 'users',
          key: 'getUsers',
          params: {...filters, communityId: community && community.id},
        },
      };
    }

    return {
      ...staticBottomSectionListProps,
      reducerStatePath: 'friendships.recommended',
      apiQuery: {domain: 'friendships', key: 'recommended'},
    };
  };

  scrollToOffset({offset, force}) {
    this.entityListsView &&
      this.entityListsView.scrollToOffset({offset, force});
  }
}

FriendsList.propTypes = {
  onScroll: PropTypes.func,
  friendRequestsNumber: PropTypes.number,
  //   approveFriendRequest: PropTypes.func,
  declineFriendRequest: PropTypes.func,
  additionalHeaderComponent: PropTypes.node,
  headerStyle: stylesScheme,
  filters: PropTypes.object,
  floatingHeader: PropTypes.node,
  hideTopSection: PropTypes.bool,
  additionalBottomComponent: PropTypes.node,
};

const mapStateToProps = (state) => ({
  friendRequestsNumber: get(state, 'friendships.friendRequestsNumber', 0),
});

const mapDispatchToProps = {
  //   approveFriendRequest,
  //   declineFriendRequest
};

FriendsList = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(FriendsList);
export default FriendsList;
